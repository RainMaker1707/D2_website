let tf = require("@tensorflow/tfjs-node");

let configurated = false;

function config(){
    configurated = true

}


function preprocess(){
    if(!configurated) config();

}

function predict(){
    if(!configurated) config();
    return 0.9;
}

function preprocess_and_predict(){
    preprocess();
    return predict();
}



module.exports = {
    test: () => {
        console.log("module triggered") 
    },
    config: config,
    preprocess: preprocess,
    predict: predict,
    preprocess_and_predict: preprocess_and_predict
}