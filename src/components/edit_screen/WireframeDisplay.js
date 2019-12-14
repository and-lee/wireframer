import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import Button from 'react-materialize/lib/Button';
import TextInput from 'react-materialize/lib/TextInput';

class WireframeDisplay extends React.Component {
    state = {
        width: this.props.wireframe.width,
        height: this.props.wireframe.height,

        controls: this.props.wireframe.controls
    }


    createControl(control) {
        let controlDiv;
        let type = control.type;
        let styles;

        if(type=="container") {
            styles = {
                position: "absolute",
                left: control.position[0], //pos x
                top: control.position[1], //pos y
                width: control.width,
                height: control.height,
                backgroundColor: control.backgroundColor,
                borderColor: control.borderColor,
                borderWidth: control.borderWeight,
                borderRadius: control.borderRadius,
                borderStyle: "solid",
    
                //z-index
            }
        }
        if(type=="label" | type=="button" | type=="textfield") {
            styles = {
                position: "absolute",
                left: control.position[0], //pos x
                top: control.position[1], //pos y
                width: control.width,
                height: control.height,
                backgroundColor: control.backgroundColor,
                borderColor: control.borderColor,
                borderWidth: control.borderWeight,
                borderRadius: control.borderRadius,
                borderStyle: "solid",
    
                //z-index
                fontSize: control.fontSize,
                textColor: control.textColor,
            }
        }
        

        switch(type) {
            case "container":
                controlDiv = 
                    <div style ={styles}>
                    </div>;
            break;

            case "label":
                controlDiv = 
                    <div style ={styles}>
                        {control.text}
                    </div>;
            break;
            
            case "button":
                
                controlDiv = 
                    <Button style ={styles}>
                        {control.text}
                    </Button>;
            break;

            case "textfield":
                controlDiv = 
                    <TextInput style ={styles}
                        placeholder = {control.text} >

                    </TextInput>;
            break;
            
        }
        
        return (
            controlDiv
        );

    }


    renderDiagram() {
        let diagram = [];
        for(let i=0; i<this.props.wireframe.controls.length; i++) {
            diagram.push(this.createControl(this.props.wireframe.controls[i]));
        }
        return diagram;
    }

    updateDimensions = () => {
        // Non-integer dimension or integers smaller than 1 or larger than 5000 should be disregarded and should not update the diagram. 
        //let p = document.getElementById('diagram');
        //var name = React.findDOMNode(this.refs.cpDev1).value;
        let p = React.findDOMNode(this.refs.diagram);
        p.style.width = this.width;
        p.style.height = this.height;
        

    }


    render() {
        const wireframe = this.props.wireframe;

        return (
            <div>
                {this.renderDiagram()}

            </div>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    const wireframe = ownProps.wireframe;
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
)(WireframeDisplay);