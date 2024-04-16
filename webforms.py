from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField , PasswordField , BooleanField, ValidationError
from wtforms import validators
from wtforms.validators import DataRequired , Email , EqualTo,  Length


class loginForm(FlaskForm):
    email = StringField("")
    password = PasswordField("")
    submit = SubmitField("Sign in")

class registerForm(FlaskForm):
    email = StringField("Email", [validators.DataRequired(), validators.Email()], render_kw={"autocomplete": "email"})
    username = StringField("Username", [validators.DataRequired()], render_kw={"autocomplete": "username"})
    lastname = StringField("lastname", [validators.DataRequired()], render_kw={"autocomplete": "username"})
    password = PasswordField("Password", validators=[DataRequired(), EqualTo('password2', message="Passwords Must Match ")], render_kw={"autocomplete": "new-password"})
    password2 = PasswordField("Confirm Password", validators=[DataRequired()], render_kw={"autocomplete": "new-password"})
    submit = SubmitField("Register")

class changeUserPassword(FlaskForm):
    password_1 = PasswordField("Password", validators=[DataRequired(), EqualTo('password_2', message="Passwords Must Match ")], render_kw={"autocomplete": "new-password"})
    password_2 = PasswordField("Confirm Password", validators=[DataRequired()], render_kw={"autocomplete": "new-password"})
    submit = SubmitField("Update")

class projectName(FlaskForm):
    name = StringField("Project Name", [validators.DataRequired()], render_kw={"autocomplete": "off"})
    submit = SubmitField("Add Project")

class searchForm(FlaskForm):
    searched = StringField("Search", [validators.DataRequired()], render_kw={"autocomplete": "on"})
    submit = SubmitField("Submit")
    
