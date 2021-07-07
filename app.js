
const express = require('express')
const path = require('path')
let _ = require('lodash')
const {rightNow} = require('./src/date')

//require env
require('dotenv').config({ path: './config/dev.env' })

require('./db/mongooseDb')

const { Post } = require('./models/postModel')


const app = express()
app.use(express.urlencoded( { extended: true } ))
app.set('view engine', 'ejs')

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '/public')
app.use(express.static(publicDirectoryPath))  //serve static files


// variables
//let posts = []

//-- routes

app.get('/', (req, res) => {

    Post.find({}, (error, result) => {
        if(error){
            console.log(error)    
        }
        else{
            res.render('home.ejs', { title: 'My Home Page', paragraph1: para1, posts: result})
        }
    })


    
})

app.get('/about', (req, res) => {
    res.render('about.ejs', { title: 'About us.... huh.', paragraph1: para2})
})

app.get('/contact', (req, res) => {
    res.render('contact.ejs', { title: 'Contact us page', paragraph1: para3})
})

app.get('/compose', (req, res) => {
    res.render('compose.ejs', { title: 'tell me about your day', })
})

//====test=
const para1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
const para2 = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, "
const para3 = "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, "
// let logTime = (`${rightNow().date} at ${rightNow().time}`)

// const post1 = new Post ({
//     name: 'bath',
//     content: para1,
//     time: logTime
// })

// const post2 = new Post ({
//     name: 'eat',
//     content: para2,
//     time: logTime
// })

// const post3 = new Post ({
//     name: 'learn',
//     content: para3,
//     time: logTime
// })


/* app.get('/compose/test', (req, res) => {
    post1.save()
    post2.save()
    post3.save()
    
    res.render('compose.ejs', { title: 'tell me about your day', })

}) */

//======test

app.post('/compose', async (req, res) => {
    //console.log(req.body)
    //console.log(`${rightNow().date} at ${rightNow().time}`)
    let logTime = (`${rightNow().date} at ${rightNow().time}`)
    

    // mongoose way
    const newPost = new Post({
        name: req.body.composedtitle,
        content: req.body.composedMessage,
        time: logTime
    })
    
    try {
        const findPost = await Post.findOne( {name: req.body.composedtitle} )

        if(!findPost){
            console.log('no previous entry found')
            await newPost.save()
            res.render('post.ejs', { title: 'compendium', viewPost: newPost} )
                        
        }
        else{
            console.log('name already exists')
            res.redirect('/')
            
        }
        
    } catch (error) {
        console.log(error)
    }
    
    //-----mongoDB way
    // const post = {
    //     name: req.body.composedtitle,
    //     content: req.body.composedMessage,
    //     time: logTime
    // }
    // Post.insertMany(post, (error, result) => {
    //     if(error){
    //         console.log(error)
    //     }
    //     else{
    //         res.redirect('/')
    //     }
    // })
    
    
    
})

app.get('/posts/:taskTitle', async (req, res) => {
    //console.log(req.params.taskTitle)
    let postQuery = _.toLower(req.params.taskTitle)
    //console.log(typeof(postQuery), postQuery)
    
    
    try {
        const findPost = await Post.findOne( {name: postQuery} )

        if(!findPost){
            console.log('no entry found')
            res.redirect('/')
        }
        else{
            
            res.render('post.ejs', { title: 'compendium', viewPost: findPost} )
        }
        
    } 
    catch (error) {
        console.log(error)
    }


    // other way
    /* Post.findOne( {name: postQuery} , (error, result) => {
        if(!error){
            //console.log(result)
            res.render('post.ejs', { title: 'compendium', viewPost: result} )
        }
        
        else{
            console.log(error)
        }
    }) */

    /* const match = () => {
        let matchCount = 0
        for(let i = 0; i < posts.length; i++){
            if(_.lowerCase(posts[i].newLogTitle) == _.lowerCase(taskQuery)  ){
                //return `match is found! at entry ${i}`
                matchCount = 1
                let viewPost = posts[i]
                res.render('post.ejs', { title: 'compendium', viewPost } )
            }        
            
        }
        if(matchCount == 0) {
            // return res.send({
            //     error: 'no match found'
            // })      
            
            res.render('error404', {
                title: '404',
                errorMessage: 'error 404; suss page not found'
            })
        }        
    }
    match() */

})

app.get('/deletePost/:deleteTitle' , async (req, res) => {

    const deleteQuery = _.toLower(req.params.deleteTitle)
    console.log(deleteQuery)

    try {
        const deletePost = await Post.findOneAndDelete( {name: deleteQuery })
        if(!deletePost){
            console.log('entry not found')
            res.redirect('/')
        }
        else{
            console.log('entry deleted')
            res.redirect('/')
        }

    } catch (error) {
        console.log(error)
    }

})

app.get('*', (req, res) => {
    res.render('error404', {
        title: '404',
        errorMessage: 'error 404; suss page not found'
    })
})

//=============

//-------------

app.listen( port , () => {
    console.log('now serving on port: ' + port)
    //console.log(publicDirectoryPath)
    //console.log(process.env.MONGODB_URL)
})