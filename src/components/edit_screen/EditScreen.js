import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Modal from 'react-materialize/lib/Modal';
import { getFirestore } from 'redux-firestore';

import WireframeDisplay from './WireframeDisplay'
import Button from 'react-materialize/lib/Button';

class EditScreen extends Component {
    state = {
        name: '',
        width: this.props.wireframe.width,
        height: this.props.wireframe.height,

        original: this.props.wireframe.controls,
        currentWork: this.props.wireframe.controls,
        showModal: false,
        disable: true,
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

    updateChange = (e) => {
        const { target } = e;
        

        if (target.id == "completed") {
            this.setState(state => ({
                ...state,
                [target.id]: target.checked,
            }));
        } else {
            this.setState(state => ({
                ...state,
                [target.id]: target.value,
            }),function(){
                this.disableUpdateButton();
            });
        }

    }

    showModal() {
        this.setState({
            showModal: true,
        });
    }
    hideModal() {
        this.setState({
            showModal: false,
        });
    }

    handleClose = () => {
        if(this.original == this.currentWork){ // user request close without saving > modal for confirmation
            this.showModal();
        } else {
            this.props.history.push("/");
        }
    }

    handleSave = () => {
        console.log("Diagram Saved.");




        //set original


    }

    handleConfirm = () => {
        this.handleSave();
        this.handleCancel();
    }

    handleCancel = () => {
        this.hideModal();
        this.props.history.push("/");
    }

    updateDimensions = () => {
        this.setState({
            disable: true
        },function(){
            // update database
            this.props.firestore.collection("wireframes").doc(this.props.wireframe.id).update( {
                width : this.state.width,
                height : this.state.height
            });
        });
    }

    disableUpdateButton(){
        // Non-integer dimension or integers smaller than 1 or larger than 5000 should be disregarded and should not update the diagram.
        let bool = false;
        if(this.state.width<1 | this.state.height<1 | this.state.width>5000 | this.state.height>5000 
            | (this.state.width==this.props.wireframe.width && this.state.height==this.props.wireframe.height) ) {
            bool = true;
        }
        
        this.setState({
            disable: bool
        });
    }

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        //console.log(wireframe);
        //console.log(this.state.showModal);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="edit_screen">
                <div className="row">
                    
                    <div className="col s3 side_bar">
                        <div className="input-field">
                            <label htmlFor="email" className="active">Name</label>
                            <input type="text" name="name" id="name" onChange={this.handleChange} value={wireframe.name} />
                        </div>
                        <div className="row">
                            <div className="col s3 input-field">
                                <label htmlFor="email" className="active">Width</label>
                                <input type="number" name="width" id="width" onChange={this.updateChange} value={this.state.width} />
                            </div>
                            
                            <i className="col s1 cross_icon material-icons">clear</i>
                            
                            <div className="col s3 input-field">
                                <label htmlFor="email" className="active">Height</label>
                                <input type="number" name="height" id="height" onChange={this.updateChange} value={this.state.height} />
                            </div>

                            <div className="col s3">
                                <Button
                                    style={{marginLeft: "25px", marginTop: "25px"}}
                                    disabled={this.state.disable}
                                    onClick={this.updateDimensions}>
                                Update</Button>
                            </div>
                            
                        </div>
                        



                        <div>Controls</div>

                    </div>

                    <div className="col s6">
                        <div className="wireframe_container">
                            <div className="diagram" style={{width: wireframe.width, height: wireframe.height}}>
                                <WireframeDisplay wireframe={wireframe} />
                            </div>
                        </div>
                    </div>

                    <div className="col s3 side_bar">
                        <div className="row">
                            <div className="col s3 center_text">
                                <i className="card_button material-icons">zoom_out</i>
                            </div>
                            <div className="col s3 center_text">
                                <i className="card_button material-icons">zoom_in</i>
                            </div>
                            <div className="col s3 center_text">
                                <i className="card_button material-icons"
                                    onClick={this.handleSave}>
                                save</i>
                            </div>
                            <div className="col s3 center_text">
                                <i className="card_button material-icons"
                                    onClick={() => this.handleClose()}>
                                close</i>
                            </div>

                        </div>
                        <div>Properties</div>


                    </div>

                    <Modal className="delete_modal" header="Close Wireframe"
                            open={this.state.showModal}
                            options={{dismissible: false}}
                            actions={
                                <div>
                                    <button className="btn waves-effect waves-light z-depth-0" onClick={this.handleConfirm}>Yes</button>
                                    &nbsp;
                                    <button className="btn waves-effect waves-light grey lighten-1 z-depth-0" onClick={this.handleCancel}>No</button>
                                </div>
                            }>
                                <p> Would you like to save before exiting? </p>
                                <div>Click [yes] to save the diagram.</div>
                    </Modal>

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