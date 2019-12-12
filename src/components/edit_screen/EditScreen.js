import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Modal from 'react-materialize/lib/Modal';
import { getFirestore } from 'redux-firestore';

class EditScreen extends Component {
    state = {
        name: '',
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        // update database
        this.props.firestore.collection("wireframes").doc(this.props.wireframe.id).update( {
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
        const wireframe = this.props.wireframe;
        console.log(wireframe); ///
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="row">
                
                <div className="col s3">
                    <div className="input-field">
                        <label htmlFor="email" className="active">Name</label>
                        <input type="text" name="name" id="name" onChange={this.handleChange} value={wireframe.name} />
                    </div>
                    <div>Controls</div>

                </div>

                <div className="col s6">
                    <div>

                    </div>
                </div>

                <div className="col s3">
                    <div className="row">
                        <div className="col s1 card">
                            Test

                        </div>
                        ZOOM+ ZOOM- Save Close

                    </div>
                    <div>Properties</div>

                </div>
                
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { wireframes } = state.firestore.data;
  const wireframe = wireframes ? wireframes[id] : null;
  wireframe.id = id;

  return {
    wireframe,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'wireframes' },
  ]),
)(EditScreen);