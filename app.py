from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify,send_file
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_migrate import Migrate
from webforms import loginForm, registerForm, projectName, changeUserPassword, searchForm
from functools import wraps 
import requests
from modeldb import User, admin_required,Project,Data,GeoJSONFile,db,login_manager,app,File
from portal import register, verify_otp,success,login,logout,changePassword
import geopandas as gpd
from sqlalchemy.ext.mutable import MutableDict
from waitress import serve
from werkzeug.utils import secure_filename
import os
import json
import shutil
from Deletion import delete , delete_project ,delete_layer ,delete_file , delete_all_files


ADMIN = 2


    
def save_folder(folder, project_id):
    # Define the upload directory
    upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], f"project_{project_id}")
    # Create the upload directory if it doesn't exist
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Save the folder contents to the upload directory
    for file in os.listdir(folder):
        src = os.path.join(folder, file)
        dst = os.path.join(upload_dir, file)
        shutil.move(src, dst)
    
    # Return the path to the upload directory
    return upload_dir


@app.route('/')
def index():
    
    return render_template("index.html")


@app.route('/dashboard')
@login_required
def dashboard():
    return render_template("dashboard.html")


@app.route('/status/<int:id>' , methods=('GET' , 'POST'))
@login_required
@admin_required
def status(id):
    name_of_project = None
    ProjectName = projectName()
    user = User.query.get_or_404(id)
    projects = user.project
    if ProjectName.validate_on_submit():
        
        name_of_project = ProjectName.name.data
        ProjectName.name.data = ''
        p = Project(name=name_of_project, user_id=user.id)
        db.session.add(p)
        db.session.commit()
        
        flash(" New Project Added " , "success")

        return redirect(url_for("status" , id=user.id))

    else:
        return render_template("status.html" , user=user , projects=projects , ProjectName=ProjectName)

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

# Define allowed extensions for documents
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'}
UPLOAD_FOLDER = 'static/uploads'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)



def allowed_images(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
def allowed_files(filename):
    extension = filename.rsplit('.', 1)[1].lower()
    
    return '.' in filename and extension in ALLOWED_DOCUMENT_EXTENSIONS

def handle_folder_upload(folder, folder_name, pro):
    if folder:
        for folder_item in folder:
            if folder_item and allowed_images(folder_item.filename):
                original_filename = os.path.basename(folder_item.filename)
                folder_name = secure_filename(folder_name)
                # Concatenate folder name with file name to ensure uniqueness
                filename = secure_filename(original_filename)
                unique_filename = os.path.join(folder_name, filename)
                folder_path = os.path.join(app.config['UPLOAD_FOLDER'], pro.name, 'images', folder_name)
                if os.path.exists(folder_path) and os.path.isdir(folder_path):
                    file_path = os.path.join(folder_path, filename)
                    # Check if the file already exists in the database
                    existing_file = File.query.filter_by(name=filename, folder_name=folder_name, project_id=pro.id).first()
                    if not existing_file:
                        folder_item.save(file_path)
                        file_database_path = os.path.join('uploads', pro.name, 'images', folder_name, filename)
                        new_file = File(name=filename, path=file_database_path, folder_name=folder_name,
                                        type='image', project_id=pro.id)
                        db.session.add(new_file)
                        db.session.commit()
                        flash('File uploaded successfully', 'success')
                else:
                    os.makedirs(folder_path, exist_ok=True)
                    file_path = os.path.join(folder_path, filename)
                    # Check if the file already exists in the database
                    existing_file = File.query.filter_by(name=filename, folder_name=folder_name, project_id=pro.id).first()
                    if not existing_file:
                        folder_item.save(file_path)
                        file_database_path = os.path.join('uploads', pro.name, 'images', folder_name, filename)
                        new_file = File(name=filename, path=file_database_path, folder_name=folder_name,
                                        type='image', project_id=pro.id)
                        db.session.add(new_file)
                        db.session.commit()
                        flash('File uploaded successfully', 'success')
    return redirect(url_for('add_layer', id=pro.id))

def handle_document_upload(documents, pro):
    for document in documents:
        if allowed_files(document.filename):
            original_filename = secure_filename(document.filename)
            document_path = os.path.join(app.config['UPLOAD_FOLDER'], pro.name, 'documents', original_filename)
            os.makedirs(os.path.dirname(document_path), exist_ok=True)
            document.save(document_path)
            file_database_path = os.path.join('uploads', pro.name, 'documents', original_filename)
            new_document = File(name=original_filename, path=file_database_path, folder_name='', type='document',
                                project_id=pro.id)
            db.session.add(new_document)
            db.session.commit()
            flash(f'Document "{original_filename}" uploaded successfully', 'success')
        else:
            flash(f'Error: File "{document.filename}" is not allowed. Please upload a valid document file.', 'error')

@app.route('/status/project/<int:id>', methods=('GET', 'POST'))
@login_required
@admin_required
def add_data(id):
    pro = Project.query.get_or_404(id)
    folder_data = File.query.filter_by(project_id=pro.id).all()
    layers = GeoJSONFile.query.filter_by(project_id=pro.id).all()

    if request.method == 'POST':
        
        if 'folder_upload' in request.files:
            folder = request.files.getlist('folder_upload')
            first_file_path = folder[0].filename
            folder_name = os.path.dirname(first_file_path)
            handle_folder_upload(folder, folder_name, pro)
            return redirect(request.referrer)
        if 'document_upload' in request.files:
            documents = request.files.getlist('document_upload')
            if documents[0].filename:  # Check if at least one document is uploaded
                handle_document_upload(documents, pro)
                return redirect(request.referrer)
            else:
                flash('No documents were uploaded', 'info')
                return redirect(request.referrer)
            
        if 'geojson_upload' in request.files:
            geojson_file = request.files['geojson_upload']
            name = request.form['name'].replace(' ', '_') 
            color = request.form['combinedColor']
            if geojson_file:
                filename = geojson_file.filename
                data = json.load(geojson_file)  # Load GeoJSON data from file
                existing_file = GeoJSONFile.query.filter_by(name=name, project_id=pro.id).first()
                if existing_file:
                    flash('A layer with the same name already exists.', 'info')
                else:
                    new_file = GeoJSONFile(name=name, filename=filename, data=data, color=color, project_id=pro.id)
                    db.session.add(new_file)
                    db.session.commit()
                    return redirect(request.referrer)
        return redirect(request.referrer)
    return render_template("add_layer.html",pro=pro, user=pro.user, files=layers, existing=pro.data, folder_data=folder_data)



@app.route('/users')
@admin_required
@login_required
def users():

    users = User.query.order_by(User.date_added).all()
    return render_template('users.html', users=users)


@app.route('/update/<int:id>' , methods=('GET','POST'))
@login_required
@admin_required
def update(id):

    RegisterForm = registerForm()
    name_to_update = User.query.get_or_404(id)

    if RegisterForm.validate_on_submit():

        name_to_update.email =  RegisterForm.email.data
        hashed_pw = generate_password_hash(RegisterForm.password.data  , "sha256")

        name_to_update.password = RegisterForm.password.data 

        RegisterForm.email.data = ''
        RegisterForm.password.data = ''

        try:

            db.session.commit()
            flash("User updated successfully", "success")

            return redirect(url_for('users'))

        except:
            
            flash(" Some Occurred Please try again " , "error")
            return render_template('users.html',RegisterForm=RegisterForm, user=name_to_update)

    else:
        return render_template('update.html',RegisterForm=RegisterForm, user=name_to_update)

@app.route('/dashboard/application/<int:id>')
@login_required
def project(id):
    # Assuming you have a Project model with 'id' as the primary key
    project = Project.query.get_or_404(id)
   
    # Filter files by project_id
    files = GeoJSONFile.query.filter_by(project_id=id).all()
    
    serialized_files = []
    for file in files:
        serialized_file = {
            "id": file.id,
            "name": file.name,
            "filename": file.filename,
            "data": file.data,
            "color": file.color
        }
        serialized_files.append(serialized_file)

    return render_template("layout.html", files=serialized_files, id=id)


@app.route('/get-images/<int:project_id>', methods=['GET'])
def get_images(project_id):
    # Query the database to retrieve image URLs for the specified project_id
    images = File.query.filter_by(project_id=project_id, type='image').all()
    
    # Initialize an empty list to store image paths
    image_paths = []
    
    # Append each image path to the list
    for image in images:
        path='/static/'+image.path
        image_paths.append(path)

    # Return the list of image paths as a JSON response
    return jsonify({'images': image_paths})


@app.route('/get-docs/<int:project_id>', methods=['GET'])
def get_docs(project_id):
    # Query the database to retrieve document names and paths for the specified project_id
    docs = File.query.filter_by(project_id=project_id, type='document').all()
    
    # Initialize an empty list to store document details
    docs_info = []
    
    # Append each document details to the list
    for doc in docs:
        doc_info = {
            'id': doc.id,
            'name': doc.name,
            'path': '/static/' + doc.path  # Assuming documents are stored in the static folder
        }
        docs_info.append(doc_info)
        
    # Return the list of document details as a JSON response
    return jsonify({'docs': docs_info})


from flask import send_file

@app.route('/download/<int:id>', methods=['GET'])
def download_document(id):
    print(id)
    doc = File.query.get_or_404(id)
    document_path = os.path.join('static', doc.path) 
    print(document_path)
    filename = doc.name  # You can use the file name instead of the filename extracted from the path
    
    # Return the document file for download
    return send_file(document_path, as_attachment=True)
   
dev = True
# dev = False


if __name__ == "__main__":  
    with app.app_context():
        db.create_all()

    if dev:
        app.run(host="0.0.0.0", debug=True, port=5000)
    
    else:
        serve(app , host="0.0.0.0", port=5000, threads=4 , url_prefix="/Nevar_systems")
