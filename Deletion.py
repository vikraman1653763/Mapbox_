from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from modeldb import User, admin_required,Project,Data,GeoJSONFile,db,login_manager,app,File
from flask import Flask,  render_template , request , flash , redirect , url_for , abort, json, jsonify,send_file

import os


ADMIN = 2

@app.route('/delete/<int:id>', methods=('GET', 'POST'))
@login_required
@admin_required
def delete(id):
    user_to_delete = User.query.get_or_404(id)

    if user_to_delete:
        # Delete associated projects
        projects = Project.query.filter_by(user_id=user_to_delete.id).all()
        for project in projects:
            Data.query.filter_by(project_id=project.id).delete()
            GeoJSONFile.query.filter_by(project_id=project.id).delete()
            File.query.filter_by(project_id=project.id).delete() 
            db.session.delete(project)

        # Commit changes
        db.session.commit()

        # Delete the user
        db.session.delete(user_to_delete)
        db.session.commit()

        flash("User and associated data deleted successfully", "info")
        return redirect(url_for('users'))

    else:
        flash("User Not Found", "error")
        return redirect(request.referrer)
          

@app.route('/delete/project/<int:id>', methods=('GET','POST'))
@login_required
@admin_required
def delete_project(id):
    project = Project.query.get_or_404(id)

    if project:
        
        Data.query.filter_by(project_id=id).delete()
        GeoJSONFile.query.filter_by(project_id=id).delete()
        File.query.filter_by(project_id=id).delete() 
        db.session.delete(project)
        db.session.commit()

        flash("Project Deleted", "error")
        return redirect(request.referrer)
    else:
        flash("Project Not Found", "info")
        return redirect(request.referrer)

@app.route('/deletelayer/project/folder/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def delete_layer(id):
    file = GeoJSONFile.query.get_or_404(id)
    db.session.delete(file)
    db.session.commit()
    return redirect(request.referrer)

@app.route('/delete/project/folder/<int:id>', methods=['GET', 'POST'])
@login_required
@admin_required
def delete_file(id):
    file = File.query.get_or_404(id)
    if file:
        try:
            # Delete the file from the directory
            os.remove(os.path.join('static', file.path))

        except FileNotFoundError:
            # Handle case where file is not found
            pass

        db.session.delete(file)
        db.session.commit()
        flash("File Deleted", "error")
        return redirect(request.referrer)
    else:
        flash("File Not Found", "info")
        return redirect(request.referrer)
    
@app.route('/delete_all_files/<int:project_id>/<type>', methods=['GET', 'POST'])
@login_required
@admin_required
def delete_all_files(project_id, type):
    # Get all files in the folder
    files_to_delete = File.query.filter_by(project_id=project_id, type=type).all()

    # Delete each file and remove from directory
    for file in files_to_delete:
        try:
            # Delete the file from the directory
            os.remove(os.path.join('static', file.path))
        except FileNotFoundError:
            # Handle case where file is not found
            pass
        db.session.delete(file)

    # Commit changes after deleting all files
    db.session.commit()

    flash("All files deleted successfully", "success")
    return redirect(request.referrer)

