const dynamoose = require('dynamoose');
const uuid = require('uuid');
dynamoose.aws.sdk.config.update({
    "accessKeyId": "AKIAT2ZQT3OJONAWUKLP",
    "secretAccessKey": "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",
    region: 'us-east-1',
});
//dynamoose.aws.ddb.local('http://localhost:8000/');

const followersSchema = new dynamoose.Schema({
        id: {
            type: String,
            hashKey: true,
            default: uuid.v1(),
        },    
        user_id:{
            type: String,
            required: true,
        },
        user_followed:{
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = dynamoose.model('Followers', followersSchema);