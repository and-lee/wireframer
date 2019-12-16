import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
//import { PhotoshopPicker } from 'react-color';

class controlProperties extends React.Component {
    
    state = {
        text: null,
        fontSize: null,
        textColor: null,
        backgroundColor: null,
        borderWidth: null,
        borderRadius: null,
    }

    handleChange = (e) => {
        const { target } = e;
        
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }),function(){
            console.log(target.value);
            this.props.control[target.id] = target.value;
        });


        /*if(target.id =="fontSize") {
            this.props.control[target.id] = target.value+"px";
        }*/
        
        //console.log(target.value);
        console.log(this.props.control);
    }



    render() {
        const control = this.props.control;
        //console.log(control);
        if (control==null) {
            return (<></>); // no control selected
        }
        return (
            <div>
                {control.text ?
                    <div className="input-field">
                            <label className="active">Text</label>
                            <input type="text" name="text" id="text" onChange={(e) => this.handleChange(e)} value={control.text} />
                    </div> : <></> }
                {control.fontSize ?
                    <div className="input-field">
                            <label className="active">Font Size</label>
                            <input className="nums" type="number" name="fontSize" id="fontSize" onChange={(e) => this.handleChange(e)} value={control.fontSize} />
                    </div> : <></> }
                {control.textColor ?
                    <div> Text Color
                            <input type="color" name="textColor" id="textColor" onChange={(e) => this.handleChange(e)} value={control.textColor} />
                    </div> : <></> }

                    <div> Background Color
                            <input type="color" name="backgroundColor" id="backgroundColor" onChange={(e) => this.handleChange(e)} value={control.backgroundColor} />
                    </div>
                    <div> Border Color
                            <input type="color" name="borderColor" id="borderColor" onChange={(e) => this.handleChange(e)} value={control.borderColor} />
                    </div>

                <div className="input-field">
                            <label className="active">Border Width</label>
                            <input className="nums" type="number" name="borderWidth" id="borderWidth" onChange={(e) => this.handleChange(e)} value={control.borderWidth} />
                </div>
                
                <div className="input-field">
                            <label className="active">Border Radius</label>
                            <input className="nums" type="number" name="borderRadius" id="borderRadius" onChange={(e) => this.handleChange(e)} value={control.borderRadius} />
                </div>
                
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