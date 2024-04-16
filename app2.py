from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from waitress import serve
from flask_migrate import Migrate
import os
from sqlalchemy.ext.mutable import MutableDict
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/loginNevar'
app.config['SECRET_KEY'] = "SECRET KEY"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
db = SQLAlchemy(app)
migrate = Migrate(app , db)

    
class GeoJSONFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    filename = db.Column(db.String(100))
    data = db.Column(MutableDict.as_mutable(db.JSON))
    color = db.Column(db.String(100))

@app.route('/')
def index():
    files = GeoJSONFile.query.all()
    return render_template('index.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        name = request.form['name']
        color = request.form['combinedColor']
        if file:
            filename = file.filename
            data = json.load(file)  # Load GeoJSON data from file
            new_file = GeoJSONFile(name=name, filename=filename, data=data, color=color)
            db.session.add(new_file)
            db.session.commit()
            return redirect(url_for('index'))

    return render_template('index.html')
 
@app.route('/shape')
def shape():
    files = GeoJSONFile.query.all()
    serialized_files = []
    for file in files:
        serialized_file = {
            "id": file.id,
            "name": file.name,
            "filename": file.filename,
            "data": file.data,
            "color":file.color
        }
        serialized_files.append(serialized_file)

    # Pass the serialized files to the template
    return render_template('shape.html', files=serialized_files)
@app.route('/preview')
def preview():
    files = GeoJSONFile.query.all()
    serialized_files = []
    for file in files:
        serialized_file = {
            "id": file.id,
            "name": file.name,
            "filename": file.filename,
            "data": file.data,
            "color":file.color
        }
        serialized_files.append(serialized_file)

    # Pass the serialized files to the template
    return render_template('preview.html', files=serialized_files)

@app.route('/delete/<int:id>', methods=['POST'])
def delete_file(id):
    file = GeoJSONFile.query.get_or_404(id)
    db.session.delete(file)
    db.session.commit()
    return redirect(url_for('index'))


dev = True
# dev = False


if __name__ == "__main__":  
    with app.app_context():
        db.create_all()

    if dev:
        app.run(host="0.0.0.0", debug=True, port=5000)
    
    else:
        serve(app , host="0.0.0.0", port=5000, threads=4 , url_prefix="/Nevar_systems")
