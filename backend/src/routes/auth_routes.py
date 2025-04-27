from flask import jsonify
from flask import request
from src.models import User
from src.models import ToDo
from flask_jwt_extended import JWTManager, create_access_token
from src import db
from werkzeug.security import generate_password_hash, check_password_hash


def testing_routes(app):

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok'}), 200

    @app.route('/', methods=['GET'])
    @app.route('/api', methods=['GET'])
    @app.route('/api/hello', methods=['GET'])
    def hello_world():
        return jsonify({'message': 'Hello, World!'}), 200

    """
    Get all registered user
    """
    @app.route('/api/users', methods=['GET'])
    def get_users():
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        print("\nUsers =>", users_list)
        return jsonify({'error': 'None', 'data': users_list}), 200

    """
    Get all ToDos
    """
    @app.route('/api/todos', methods=['GET'])
    def get_todos():
        todos = ToDo.query.all()
        todo_list = [todo.to_dict() for todo in todos]
        print("\nTodos =>", todo_list)
        return jsonify({'error': 'None', 'data': todo_list}), 200

    """
    Delete a ToDo by ID
    """
    @app.route('/api/admin/todo/<int:id>', methods=['DELETE'])
    def delete_todo_admin(id):
        try:
            todo = ToDo.query.get(id)
            if todo:
                db.session.delete(todo)
                db.session.commit()

            return jsonify({"message": "Todo deleted successfully"}), 200
        except Exception as e:
            return jsonify({
                "message": "Error deleting ToDo",
                "error": str(e)}), 500


def auth_routes(app):
    """
    User signup
    """
    @app.route("/api/register", methods=['POST'])
    def sign_up():

        reg_form = request.get_json()

        user_name = reg_form.get('user_name')
        password = reg_form.get('password')
        conf_passwrd = reg_form.get('confirm_password')

        print("\nInput data => ", user_name, password, conf_passwrd)

        if not user_name or len(user_name) < 3:
            return jsonify({
                'status': 'Failed',
                'message': 'Invalid username'}), 400

        if not password or len(password) < 7 or password != conf_passwrd:
            return jsonify({
                'status': 'Failed',
                'message': 'Invaid password'}), 400

        existing_user = User.query.filter_by(user_name=user_name).first()
        if existing_user:
            return jsonify({
                'status': 'Failed',
                'message': 'Username already taken'}), 400

        new_user = User(
            user_name=user_name,
            password=generate_password_hash(
                password, method='pbkdf2:sha256'
            )
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'status': 'Success',
            'message': "User registration completed successfully"}), 200

    """
    User login
    """
    @app.route('/api/login', methods=['POST'])
    def login():

        login_info = request.get_json()
        user_name = login_info.get('user_name')
        passowrd = login_info.get('password')

        print(f"\nLogin => User name: {user_name}  Pass: {passowrd}")

        user = User.query.filter_by(user_name=user_name).first()

        if not user or not check_password_hash(user.password, passowrd):
            return jsonify({'message': 'Invalid creds'}), 400

        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    """
    User logout
    """
    @app.route("/api/logout", methods=["GET"])
    def logout():
        try:
            # logout_user()
            return jsonify({"message": "Logout successful"}), 200
        except Exception as e:
            return jsonify({
                "message": "Error during logout",
                "error": str(e)}), 500
