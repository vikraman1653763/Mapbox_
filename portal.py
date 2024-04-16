from modeldb import User, admin_required,Project,Data,GeoJSONFile,db,login_manager,app
from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from webforms import loginForm, registerForm, projectName, changeUserPassword, searchForm
from werkzeug.security import generate_password_hash, check_password_hash


@app.route('/register' , methods=('GET' , 'POST'))
def register():
    if request.method == 'POST':
        error_message = request.form.get('errorMessage')
        flash(error_message, "error_msg")
        
        return jsonify({'status': 'success'}), 200
    
    else:
        action='register'
        return render_template('register.html', action=action)

@app.route('/verify_otp', methods=['POST'])
def verify_otp():
    try:
        # Retrieve user details from the request
        data = request.get_json()
        username = data.get('username')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')
        
        # Save user details to the database
        new_user = User(username=username, lastname=lastname, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'success': True, 'message': 'User registered successfully'})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': 'Error saving user details'})
    
@app.route('/success')
def success():
    return render_template('success.html')

@app.route('/logout' , methods=('GET' , 'POST'))
@login_required
def logout():
    logout_user()
    flash(" Loged Out Succesfully !! " , "info")
    return redirect(url_for('login'))



@app.route('/login' , methods=('GET' , 'POST'))
def login():

    email = None
    password = None
    LoginForm = loginForm()

    if LoginForm.validate_on_submit():

        email = LoginForm.email.data
        password = LoginForm.password.data
        print(email,password)
        LoginForm.email.data = ''
        LoginForm.password.data = ''

        user = User.query.filter_by(email=email).first()

        if user is not None:
            
            if user.password == password:
                
                login_user(user)
                flash(" logged in successfully !! ", "success")

                if password == "default":
                    
                    return redirect(url_for('changePassword'))
                    

                if user.role == "admin":
                    return redirect(url_for('users'))
                else:
                    return redirect(url_for('dashboard'))
            
            else:
                flash(" Invalid Email/Password !! " , "error_msg")
        
        else:
            flash(" Invalid Email/Password !! " , "error_msg")            
        

    return render_template("login.html" , LoginForm=LoginForm)

@app.route('/changePassword' , methods=('GET' , 'POST'))
@login_required
def changePassword():

    pwd_to_update = current_user
    Change_pwd = changeUserPassword()

        
    if Change_pwd.validate_on_submit():
        
        hashed_pw = generate_password_hash(Change_pwd.password_1.data  , "sha256")

        pwd_to_update.password = hashed_pw
        Change_pwd.password_1.data = ''

        try:

            db.session.commit()
            flash("Password updated successfully", "success")

            return redirect(url_for('dashboard'))

        except:
            
            flash(" Some Occurred Please try again " , "error")
            return redirect(url_for('dashboard'))

    else:
    
    
        return render_template('change_password.html' , Change_pwd=Change_pwd)

