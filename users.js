const faunadb = require('faunadb');
var client = new faunadb.Client({secret: process.env.FAUNA_SECRET});
const {
    Paginate,
    Get,
    Update,
    Select,
    Match,
    Index,
    Create,
    Collection,
    Lambda,
    Var,
    Join,
    Ref,
} = faunadb.query;

//GET

async function get(id) {
    let user = await client.query (
        Get(
            Ref (
                Collection('users'),
                id
            )
        )
    );

    return user;
}

//CREATE

async function create(userName, displayName, profileImageUrl, twitchId, accessToken, refreshToken, viewCount) {
    data = {
        userName: userName,
        displayName: displayName,
        profileImageUrl: profileImageUrl,
        twitch: {
            id: twitchId,
            accessToken:accessToken,
            refreshToken: refreshToken,
            userName: userName,
            displayName: displayName,
            profileImageUrl: profileImageUrl,
            viewCount: viewCount
        }
    };

    let user = await client.query (
        Create(
            Collection('users'),
            { data }
        )
    ).catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
    ));
    
    return user;
}

//UPDATE
async function update(id, data) {
    let user = await client.query (
        Update(
            Ref(Collection('users'), id),
            {data}
        )
    ).catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
    ));

    return user;
}

//PAGINATE

async function paginateByName(userName, size) {
    let user = await client.query(Paginate(
        Match(
            Index("users_by_name"), userName
        ), 
        {size:size}
    )).catch((err) => console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
    ));

    return user;
}

//COMPLEX

async function findOrCreateUser(userName, displayName, profileImageUrl, twitchId, accessToken, refreshToken, viewCount) {

    let user;
    let userPaginate = await paginateByName(userName);

    if(userPaginate.data[0].id == undefined) {
        user = await create(userName, displayName, profileImageUrl, twitchId, accessToken, refreshToken, viewCount);
        return user;
    }

    data = {
        displayName: displayName,
        profileImageUrl: profileImageUrl,
        twitch: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            displayName: displayName,
            profileImageUrl: profileImageUrl,
            viewCount: viewCount
        }
    }

    user = await update(userPaginate.data[0].id, data);

    return user;

}

module.exports={
    get,
    create,
    update,
    paginateByName,
    findOrCreateUser
};