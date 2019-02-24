# fridgeApp

## Purpose
While working on my React & Express portfolio, I decided to solve one of my own daily issues.
The trouble starts when having a shared fridge at home. Sitting on the train, bus or zipline and dreaming about a meal you plan on making in the evening, getting to the shop to pick up the ingredients and realising that you have no idea what you already have at home - fridge, cupboard or freezer. Do I already have this? If I did, did anyone at home use it already? Now, this is where my app comes in - it allows sharing ingredients across a household, editing their expiry date, name, weight and even their icon!

## Why go through all this trouble?
Mainly and most importantly - reduce food waste. However, it may also be for money saving purposes.

## Current Feautures
* List of ingredients and their weight, state and expiry date
* Add ingredients
* Edit ingredients
* Delete ingredients
* Responsive Design
* Sign up & Login

## How to Run in Dev
Run MySQL Server

Create required tables & database

```
CREATE DATABASE `fridge`;

CREATE TABLE `items` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `expirydate` VARCHAR(55) NOT NULL,
    `name` VARCHAR(55) NOT NULL,
    `open` VARCHAR(5) NOT NULL,
    `type` VARCHAR(55) NOT NULL,
    `weight` VARCHAR (5) NOT NULL,
    `comment` TEXT NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(55) NOT NULL,
    `password` VARCHAR(155) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `fridges` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `user_access` VARCHAR(55) NOT NULL,
    `user_id` INT(11) NOT NULL,
    PRIMARY KEY (`id`)
);
```

```
cd client && npm run server
```

In a separate terminal

```
cd client && npm start
```

## Languages Used
* English
* JavaScript
    * React
    * Express
* HTML5
* CSS3

## Screenshots
* http://prntscr.com/mpfj6q - Login page
* http://prntscr.com/mpfjah - Signup page
* http://prntscr.com/mpfjwb - Home/Fridge page with all fridge items
* http://prntscr.com/mpfk2j - Editing item
* http://prntscr.com/mpfk6u - Adding item
* http://prntscr.com/mpfkbs - Give users access page

## Coming Soon

* API Access Middleware
* General Improvements
