const {model, Schema } = require('mongoose')

const newsSchema = new Schema({
    writerId:{
        type : Schema.Types.ObjectId,
        required : true,
        ref : "author"
    },
    writerName:{
        type : String,
        required : true,
    },
    title :{
        type : String,
        required : true, 
    },
    slug:{
        type : String,
        required : true,
    },   
    description :{
        type : String,
         default : "", 
    },   
    image :{
        type : String,
        required : true, 
    },   
    category :{
        type : String,
        required : true, 
        trim : true,
    },   
    sourceType :{
        type : String,
        enum : ["সংগৃহীত", "এ আই"],
        default : "সংগৃহীত",
    },   
    date :{
        type : String,
        required : true, 
    },   
    status :{
        type : String,
        default : "pending", 
    },   
    count:{
        type: Number,
        default : 0 
    }
}, {timestamps : true})

module.exports = model('news', newsSchema)