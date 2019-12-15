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
        name: this.props.wireframe.name,
        width: this.props.wireframe.width,
        height: this.props.wireframe.height,
        zoom: 1,

        original: this.props.wireframe.controls,
        currentWork: this.props.wireframe.controls,
        showModal: false,
        disable: true,

        widthC: this.props.wireframe.width,
        heightC: this.props.wireframe.height,
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
        } else if (target.id == "name") {
            this.setState(state => ({
                ...state,
                [target.id]: target.value,
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
        if((this.original != this.currentWork) | (this.state.name!=this.props.wireframe.name) 
            | (this.state.width!=this.props.wireframe.width) | (this.state.height!=this.props.wireframe.height)){ // user request close without saving > modal for confirmation
            this.showModal();
        } else {
            this.props.history.push("/");
        }
    }

    handleZoom = (magnifier) => {
        this.setState({
            zoom: this.state.zoom*magnifier
        });
    }

    handleSave = () => {
        console.log("Diagram Saved.");

        const fireStore = getFirestore();
        fireStore.collection("wireframes").doc(this.props.wireframe.id).update( {
                controls : this.state.currentWork,
                width : this.state.width,
                height : this.state.height,
                name: this.state.name,
        });
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
            disable: true,
            width: this.state.widthC,
            height: this.state.heightC,
        });
    }

    disableUpdateButton(){
        // Non-integer dimension or integers smaller than 1 or larger than 5000 should be disregarded and should not update the diagram.
        let bool = false;
        if(this.state.widthC<1 | this.state.heightC<1 | this.state.widthC>5000 | this.state.heightC>5000 
            | (this.state.widthC==this.state.width && this.state.heightC==this.state.height) ) {
            bool = true;
        }
        
        this.setState({
            disable: bool
        });
    }



    handleAddControl = (type) => {
        console.log("Add "+type);
        let addControl = this.state.currentWork;
        
        switch(type) {
            case "container":
                addControl.push({
                    key: 0,
                    type: "container",
                    width: 100,
                    height: 100,
                    position: [0,0],
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderWeight: 1,
                    borderRadius: 2
                });
            break;



        }
        

        this.setState({
            currentWork: addControl
        });

        
    }


    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
        //console.log(wireframe);
        //console.log(this.state.showModal);
        ////console.log(this.state.currentWork);
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="edit_screen">
                <div className="row">
                    
                    <div className="col s3 side_bar">
                        <div className="input-field">
                            <label htmlFor="email" className="active">Name</label>
                            <input type="text" name="name" id="name" onChange={this.updateChange} value={this.state.name} />
                        </div>
                        <div className="row">
                            <div className="col s3 input-field">
                                <label htmlFor="email" className="active">Width</label>
                                <input type="number" name="width" id="widthC" onChange={this.updateChange} value={this.state.widthC} />
                            </div>
                            
                            <i className="col s1 cross_icon material-icons">clear</i>
                            
                            <div className="col s3 input-field">
                                <label htmlFor="email" className="active">Height</label>
                                <input type="number" name="height" id="heightC" onChange={this.updateChange} value={this.state.heightC} />
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

                        <div>
                            <Button
                                onClick={() => this.handleAddControl("container")}>
                            Add Container</Button>
                        </div>
                        
                        <div>
                            <Button
                                onClick={() => this.handleAddControl("label")}> 
                            Add Label</Button>
                        </div>

                        <div>
                            <Button
                                onClick={() => this.handleAddControl("button")}> 
                            Add Text Button</Button>
                        </div>

                        <div>
                            <Button
                                onClick={() => this.handleAddControl("textfield")}> 
                            Add Textfield</Button>
                        </div>

                    </div>

                    <div className="col s6">
                        <div className="wireframe_container">
                            <div className="diagram" style={{width: this.state.width+"px", height: this.state.height+"px", transform: "scale("+this.state.zoom+")"}}>
                                <WireframeDisplay wireframe={wireframe} drawControls={this.state.currentWork}/>
                            </div>
                        </div>
                    </div>

                    <div className="col s3 side_bar">
                        <div className="row">
                            <div className="col s3 center_text">
                                <i className="card_button material-icons"
                                    onClick={() => this.handleZoom(0.5)}>
                                zoom_out</i>
                            </div>
                            <div className="col s3 center_text">
                                <i className="card_button material-icons"
                                    onClick={() => this.handleZoom(2)}>
                                zoom_in</i>
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