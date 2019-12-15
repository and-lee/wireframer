import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';


class controlProperties extends React.Component {
    state = {
        control: this.props.control, 
    }
    
    createProperty(control) {
        let controlDiv;
        let type = control.type;
        let styles;

        if(type=="container") { // createContainer()
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
                    <button style ={styles}>
                        {control.text}
                    </button>;
            break;

            case "textfield":
                controlDiv = 
                    <div></div>
            break;
            
        }
        
        return (
            controlDiv
        );

    }

    renderDiagram() {
        let diagram = [];
        for(let i=0; i<this.state.control.length; i++) {
            diagram.push(this.createProperty(this.state.control[i]));
        }
        return diagram;
    }

    render() {
        return (
            <div key={this.props.controls}>
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
)(controlProperties);