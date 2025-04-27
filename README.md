# Simple To-Do app (Flask + React)

A simple app created using [Flask]() library (for backend) and [React]() (for frontend).

## Project setup

### Setting up the backend

1. Create Python's virtual environment (recommended) :

    ```python
    python3 -m venv /path/for/venv
    ```

1. Activate the virtual envinorment :

    ```bash
    source /path/to/your/venv/bin/activate
    ```

1. Go to the projct's `/backend` directory and install dependencies :

    ```python
    pip3 install -r requirment.txt
    ```

1. Ones installed, run the app :

    ```python
    python3 app.py
    ```

1. The backend runs on **PORT** : **8000**

### Setting up the frontend

1. Go to the projct's `/backend` directory and install dependencies :

    ```bash
    npm install
    ```

1. Ones installed, run the frontend :

    ```bash
    npm run dev
    ```

1. The frontend runs on **PORT** : **5173**

### Working features

1. User authenticaiton (login, logout and registration)
1. Add, delete and update ToDos.

### Not working

1. Editing a ToDo
