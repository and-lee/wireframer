import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import Modal from 'react-materialize/lib/Modal';
import { getFirestore } from 'redux-firestore';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        // update database
        this.props.firestore.collection("todoLists").doc(this.props.todoList.id).update( {
            [target.id] : target.value
        });
    }

    handleConfirm = (e) => {
        console.log("Delete: todoList.id: " + this.props.todoList.id);
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete();
        this.props.history.goBack();
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <div className="row">
                    <h4 className="col s11 grey-text text-darken-3" id="todoListHeader">Todo List</h4>
                    <Modal header="Delete List"
                        trigger={<i className="col s1 large material-icons right grey-text text-darken-3" id="deleteList">delete_forever</i>}
                        options={{dismissible: false}}
                        actions={
                            <div>
                                <button className="btn waves-effect waves-light z-depth-0" onClick={this.handleConfirm}>Yes</button>
                                &nbsp;
                                <button className="btn waves-effect waves-light grey lighten-1 z-depth-0 modal-close">No</button>
                            </div>
                        }>
                            <p> Are you sure you want to delete this list? </p>
                            <div>The list will not be retreivable.</div>
                    </Modal>
                </div>
                
                <div className="input-field">
                    <label htmlFor="email" className="active">Name</label>
                    <input type="text" name="name" id="name" onChange={this.handleChange} value={todoList.name} />
                </div>
                <div className="input-field" >
                    <label htmlFor="password" className="active">Owner</label>
                    <input type="text" name="owner" id="owner" onChange={this.handleChange} value={todoList.owner} />
                </div>
                <ItemsList todoList={todoList} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);