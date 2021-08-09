//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg, happyDogImg, foodObj;
var feeddog, addfood;
var fedTime, lastFed;

function preload() {
    //load images here
    dogImg = loadImage('images/Dog.png');
    happyDogImg = loadImage('images/happydog.png');
}

function setup() {
    createCanvas(600, 500);

    database = firebase.database();
    foodStock = database.ref('Food');
    foodStock.on("value", readStock);

    lastFed = database.ref('lastFed');
    lastFed.on("value", function (data) {
        lastFed = data.val();
    });

    dog = createSprite(520, 250, 80, 80);
    dog.addImage(dogImg);
    dog.scale = 0.15;

    // console.log(dog.x, dog.y);

    foodObj = new Food();

    feeddog = createButton('Feed the Dog');
    feeddog.position(width / 2 - 50, 150);
    feeddog.mousePressed(feed);

    addfood = createButton('Add Food');
    addfood.position(width / 2 + 65, 150);
    addfood.mousePressed(addFoods);


}


function draw() {
    background(46, 139, 87);
    drawSprites();

    // textSize(30);
    // fill('white');
    // text('x: ' + mouseX + '   y: ' + mouseY, 20, 50);

    foodObj.display(foodS);
    // console.log(foodObj.x, foodObj.y);

    // console.log(foodS);

    //add styles here

    fill('aquamarine');
    textSize(26);
    if (lastFed > 0 || lastFed <= 24) {
        if (lastFed >= 12) {
            text('Last Fed: ' + lastFed % 12 + ' PM', 210, 50);
        }
        else if (lastFed == 0) {
            text('Last Fed: 12 AM', 210, 50);
        }
        else {
            text('Last Feed: ' + lastFed + ' AM', 210, 50);
        }
    }

    fill('aliceblue');
    textSize(20);
    if (foodS >= 0) {
        // text('Food remaining: ' + foodS, 160, 180);
    }
}

function feed() {
    dog.addImage(happyDogImg);
    dog.x = foodObj.x;
    dog.y = foodObj.y;
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1)

    database.ref('/').update({
        lastFed: hour()
    })
    if (foodS > 0) {
        database.ref('/').update({
            // Food: foodObj.getFoodStock()
            Food: foodS - 1
        })
    }
}

function addFoods() {
    dog.x = 520;
    dog.y = 250;
    foodS++;
    database.ref('/').update({
        Food: foodS
    })
}

function readStock(data) {
    foodS = data.val();
}

function writeStock(x) {
    if (x <= 0) {
        x = 0;
    }
    else {
        x -= 1;
    }
    database.ref('/').update({
        Food: x
    })
}