import React, { Component, cloneElement } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Modal from 'react-materialize/lib/Modal';
import { getFirestore } from 'redux-firestore';
import Button from 'react-materialize/lib/Button';
import { Rnd } from "react-rnd";

import WireframeDisplay from './WireframeDisplay';
import ControlProperties from './ControlProperties';

const handle = 
            <div
                style={{
                background: "#fff",
                borderRadius: "2px",
                border: "1px solid black",
                height: "100%",
                width: "100%",
                padding: 0,
                }}
            /> 

class EditScreen extends Component {
    state = {
        name: this.props.wireframe.name,
        width: this.props.wireframe.width,
        height: this.props.wireframe.height,
        zoom: 1,

        currentWork: this.props.wireframe.controls,
        showModal: false,
        disable: true,

        widthC: this.props.wireframe.width,
        heightC: this.props.wireframe.height,
        changed: false,


        selected: null,

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
        if(this.state.changed | (this.state.name!=this.props.wireframe.name) 
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
        this.setState({
            changed: false
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
        let con = {};
        
        switch(type) {
            case "container":
                con = {
                    width: 250,
                    height: 250,
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderWidth: 1,
                    borderRadius: 2
                };
            break;
            case "label":
                con = {
                    width: 100, // dynamic based on text
                    height: 25,
                    text: "Prompt for Input",
                    fontSize: 14,
                    textColor: "black",
                    backgroundColor: "none",
                    borderColor: "#000000",
                    borderWidth: 0,
                    borderRadius: 0
                };
            break;
            case "button":
                con = {
                    width: 100,
                    height: 25,
                    text: "Submit", // default text
                    fontSize: 14,
                    textColor: "black",
                    backgroundColor: "#d6d6d6",
                    borderColor: "#000000",
                    borderWidth: 1,
                    borderRadius: 2
                };
            break;
            case "textfield":
                con = {
                    width: 150,
                    height: 25,
                    text: "Input", // default text
                    fontSize: 14,
                    textColor: "#d1d1d1",
                    backgroundColor: "#ffffff",
                    borderColor: "#000000",
                    borderWidth: 1,
                    borderRadius: 2
                };
            break;
        }
        con.type = type;
        con.position = [0,0]

        this.addControl(con);
    }

    addControl = (controlProperties) => {
        let controlList = this.state.currentWork;
        controlList.push(controlProperties);
        this.setState({
            currentWork: controlList,
            changed: true
        });
    }

    /////////////////// WireframeDisplay // <WireframeDisplay controls={this.state.currentWork}/>
    createStyle = (control) => {
        let type = control.type;
        if(type=="container") { // create container
            return {
                backgroundColor: control.backgroundColor,
                borderColor: control.borderColor,
                borderWidth: control.borderWidth,
                borderRadius: control.borderRadius,
                borderStyle: "solid",
                //z-index
            }
        }
        if(type=="label" | type=="textfield") {
            return {
                backgroundColor: control.backgroundColor,
                borderColor: control.borderColor,
                borderWidth: control.borderWidth,
                borderRadius: control.borderRadius,
                borderStyle: "solid",
                //z-index
                fontSize: control.fontSize,
                color: control.textColor,
            }
        }
        if(type=="button") {
            return {
                backgroundColor: control.backgroundColor,
                borderColor: control.borderColor,
                borderWidth: control.borderWidth,
                borderRadius: control.borderRadius,
                borderStyle: "solid",
                //z-index
                fontSize: control.fontSize,
                color: control.textColor,
                textAlign: "center",
            }
        }

    }

    createControl(control) {
        let styles = this.createStyle(control);
        return (
            <Rnd
                bounds="parent"
                style={styles}
                scale = {this.state.zoom}
                default={{
                    x: control.position[0],
                    y: control.position[1],
                    width: control.width,
                    height: control.height
                }}
                
                disableDragging
                enableResizing={{top: false, bottom: false, right: false, left: false, topRight: false, topLeft: false, bottomRight: false, bottomLeft: false}}
                onClick={(e) => this.handleSelect(e, control)}
            >
            {control.text}
            </Rnd>
        );
    }
    createSelectedControl(control) {
        let styles = this.createStyle(control);
        return (
            <Rnd
                bounds="parent"
                style={styles}
                scale = {this.state.zoom}
                default={{
                    x: control.position[0],
                    y: control.position[1],
                    width: control.width,
                    height: control.height
                }}
                onDragStop={(e, d) => { control.position=[d.x,d.y] }} // changed: check state change
                onResizeStop={(e, direction, ref, delta, position) => { // changed: check state change
                    control.width = ref.style.width;
                    control.height= ref.style.height;
                }}
                resizeHandleComponent={{bottomRight: handle, topLeft: handle, topRight: handle, bottomLeft: handle}}
                enableResizing={{top: false, bottom: false, right: false, left: false, topRight: true, topLeft: true, bottomRight: true, bottomLeft: true}}
                onClick={(e) => this.handleSelect(e, control)}
            >
            {control.text}
            </Rnd>
        );
    }
    /////////////////////////////////////////////////////////////////////

    createDuplicate = () => {
        let attributes = {}; // this.state.selected.style
        for(var key in this.state.selected) { // copy
            attributes[key] = this.state.selected[key];
        }
        attributes.position = [attributes.position[0]+100, attributes.position[1]+100];
        this.addControl(attributes);
        this.setState({
            selected: this.state.currentWork[this.state.currentWork.length-1]
        });
    }

    deleteSelected = () => {
        //console.log("Delete: " + this.state.selected);
        let controlsList = this.state.currentWork;
        controlsList = controlsList.filter(c => c != this.state.selected);

        this.setState({
            currentWork: controlsList,
            selected: null
        });

    }

    handleKeyPress = (event) => { // key pressing input function
        if(event.keyCode === 68 && event.ctrlKey) { //ctrl + d
            if (this.state.selected) {
                this.createDuplicate();
                event.preventDefault();
            }
            //event.preventDefault();
        } else if(event.keyCode === 46) { // delete
            if (this.state.selected) {
                this.deleteSelected();
                event.preventDefault();
            }
            //event.preventDefault();
        }
        
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress, false);
    }

    handleSelect = (e, componentID) => {
        console.log("Selected:");
        console.log(componentID);
        this.setState({
            selected: componentID,
            changed: true
        });
        e.stopPropagation();
    }
    handleDeSelect = () => {
            this.setState({
                selected: null
            });
    }

    //////////////////// WireframeDisplay // <WireframeDisplay controls={this.state.currentWork}/>
    renderDiagram() {
        let diagram = [];
        for(let i=0; i<this.state.currentWork.length; i++) {
            if (this.state.currentWork[i]===this.state.selected) {
                diagram.push(this.createSelectedControl(this.state.currentWork[i]));
            } else {
                diagram.push(this.createControl(this.state.currentWork[i]));
            }
            
        }
        return diagram;
    }

    //////////////////// ControlProperties // <ControlProperties control={this.state.selected}/>
    createAttribute(type, value) {

        

        
        
        return (
            <div>{value}</div>
        );
    }

    renderProperties = (selectedControl) => {
        let attributes = [];
        for(var key in selectedControl) { // copy
            attributes.push(this.createAttribute(key, selectedControl[key]));
        }
        return attributes;
    }
    ////////////////////////////////////////////////////////////////////////////////

    render() {
        const auth = this.props.auth;
        const wireframe = this.props.wireframe;
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

                            <Button onClick={() => this.handleAddControl("container")}>Add Container</Button>
                        </div>
                        
                        <div>

                            <Button onClick={() => this.handleAddControl("label")}>Add Label</Button>
                        </div>

                        <div>

                            <Button onClick={() => this.handleAddControl("button")}>Add Text Button</Button>
                        </div>

                        <div>

                            <Button onClick={() => this.handleAddControl("textfield")}>Add Textfield</Button>
                        </div>

                    </div>

                    <div className="col s6">
                        <div className="wireframe_container">
                            <div className="diagram" 
                                onClick={() => this.handleDeSelect()}
                                style={{width: this.state.width+"px", height: this.state.height+"px", transform: "scale("+this.state.zoom+")"}}>
                                {this.renderDiagram()}
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
                        <div>{this.renderProperties(this.state.selected)}</div>


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