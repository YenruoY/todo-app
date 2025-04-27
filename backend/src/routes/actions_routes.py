from flask import jsonify
from flask import request
from src import db
from src.models import ToDo
from flask_jwt_extended import jwt_required, get_jwt_identity


def user_actions(app):
    """
    Create a ToDo
    """
    @app.route('/api/create_todo', methods=['POST'])
    @jwt_required()
    def create_todo():

        current_user = get_jwt_identity()
        print("\nCurrent user => ", current_user)

        todo_form = request.get_json()
        title = todo_form.get('title')
        description = todo_form.get('description')

        if not title or len(title) < 3:
            return jsonify({
                'error': 'Invaild title',
                'message': "Title should contains at least 3 words"}), 400

        # if not description or len(description) < 3:
        #     return jsonify({'error': ''}), 400

        try:
            new_todo = ToDo(
                title=title,
                description=description,
                status='inc',
                user_id=current_user
            )
            db.session.add(new_todo)
            db.session.commit()

            return jsonify({'message': 'Todo added successfully'}), 200
        except Exception as e:
            print(f"\nError => {e}")
            return jsonify({'message': 'Unable to add Todo'}), 500

    """
    Get User's ToDo list
    """
    @app.route('/api/todo_list', methods=['GET'])
    @jwt_required()
    def list_todo():
        current_user = get_jwt_identity()
        print("\nCurrent user => ", current_user)

        try:
            todos = ToDo.query.filter_by(user_id=current_user)
            todo_list = [todo.to_dict() for todo in todos]
            print("\nTodos =>", todo_list)

            return jsonify({
                'status': 'Success',
                'data': todo_list}), 200
        except Exception as e:
            print("\nError Get User todo =>", e)
            return jsonify({
                'status': 'Failed',
                'message': 'Unable to get Todo'}), 500

    """
    Edit a Todo
    """
    @app.route('/api/todo/<int:id>', methods=['PATCH'])
    @jwt_required()
    def edit_todo(id):
        current_user = get_jwt_identity()
        print(f"\nUpdate Todo => By User: {current_user}  ToDoID: {id}")

        todo = ToDo.query.get(id)

        if not todo:
            return jsonify({
                'status': 'Failed',
                'message': "Todo with that ID not found"}), 400

        if todo.user_id != int(current_user):
            return jsonify({
                'status': 'Failed',
                'message': "Unauthorized to access the Todo"}), 400

        todo_form = request.get_json()
        title = todo_form.get('title')
        description = todo_form.get('description')
        status = todo_form.get('status')

        if title:
            if len(title) > 3:
                todo.title = title
            else:
                return jsonify({
                    'status': 'Failed',
                    'message': "Title should contains at least 3 words"}), 400

        if description:
            todo.description = description

        if status:
            if status in ['inc', 'comp', 'process']:
                todo.status = status
            else:
                return jsonify({
                    'status': 'Failed',
                    'message': "Invalid status type"}), 400

        print("\nUpdated todo => ", todo)

        try:
            db.session.commit()
            return jsonify({
                'status': 'Success',
                'message': "Todo updated"}), 200
        except Exception as e:
            print(f"\nError => {e}")
            return jsonify({
                'status': 'Failed',
                'message': 'Unable to edit Todo'}), 500

    """
    Delete a Todo
    """
    @app.route('/api/todo/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_todo(id):
        current_user = get_jwt_identity()
        print("\nCurrent user => ", current_user)

        try:
            todo = ToDo.query.get(id)
            print("ToDO => ", todo)
            print("ToDO's user Id => ", todo.user_id)
            print(f"{current_user == todo.user_id}")

            if todo and int(current_user) == todo.user_id:
                print("\nTrying to delete todo => ")
                db.session.delete(todo)
                db.session.commit()

                return jsonify({
                    "message": "Todo deleted successfully",
                    "status": "Succes"
                }), 200
            else:
                return jsonify({
                    "message": "Unauthorized or Todo does not exist",
                    "status": "Failed"
                }), 400

        except Exception as e:
            print("\nError deleting Todo => ", e)
            return jsonify({
                "message": "Error deleting ToDo",
                "status": "Failed"
            }), 500
