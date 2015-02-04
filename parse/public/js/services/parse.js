//Parse Service
angular.module('parseService', [])
    .factory('ParseService', function(){

        //Init Parse
	Parse.initialize("NKnM9iqa0hnqZhA1M2TdyDYMMMVpW24QNcqaSZ2Y", "k7cekvXmYutKXkuSuOp2scFgbkRnAUdQMh4SewsG");

        var Gym = Parse.Object.extend("Gym");
        var Wall = Parse.Object.extend("Wall");
        var Route = Parse.Object.extend("Route");
        var Hold = Parse.Object.extend("Hold");

        var ParseService = {

            //Login
            login: function(username, password, callback) {
		Parse.User.logIn(username, password, {
		    success: function(user) {
			callback(user);
		    },
		    error: function(user, error) {
                        callback(error);
		    }
		});
	    },

            //Logout
            logout: function(){
                Parse.User.logOut();
            },

            //Get Current User
            getCurrentUser: function(){
                return Parse.User.current();
            },


            //****** Gyms ******//

            //Create Gym
            createGym: function(){
                var gym = new Gym();
                gym.set("name", "");
                gym.set("walls", []);
                return gym;
            },

            //Get Gyms
            getGyms: function(callback){
                var query = new Parse.Query("Gym");
                query.include("walls");
                query.include("walls.routes");
                query.include("walls.routes.holds");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get  Gym By Id
            getGymById: function(id, callback){
                var query = new Parse.Query("Gym");
                query.include("walls");
                query.include("walls.routes");
                query.include("walls.routes.holds");
                query.get(id, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },


            //Set Current Gym
            setCurrentGym: function(gym, callback){
                var user = Parse.User.current();
                user.set('currentGym', gym);
                user.save(null, {
                    success: function(user){
                        callback(user);
                    },
                    error: function(user, error){
                        callback(error);
                    }
                });
            },



            //***** Walls ******//

            //Get Walls By Gym
            getWallsByGym: function(gym, callback){
                var query = new Parse.Query("Wall");
                query.equalTo("gym", gym);
                query.include("routes");
                query.include("routes.wall");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get Wall By ID
            getWallById: function(id, callback){
                var query = new Parse.Query("Wall");
                query.include("routes");
                query.include("routes.setter");
                query.include("routes.wall");
                query.include("gym.walls.routes");
                query.get(id, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Create Wall
            createWall: function(){
                var user = Parse.User.current();
                var gym = user.get('currentGym');
                var wall = new Wall();
                wall.set("name", "");
                wall.set("description", "");
                wall.set("createdBy", user);
                wall.set("gym", gym);
                wall.set("routes", []);

                return wall;
            },

            saveWall: function(wall, callback){
                //Update lastSet
                var today = new Date();
                wall.attributes.lastSet = today;

                //Set all attributes
                for(var attr in wall.attributes) {
                    wall.set(attr, wall.attributes[attr]);
                }

                //Set all route.atttributes.wall = wall;
                var routePromises = [];
                wall.attributes.routes.forEach(function(route){
                    route.set("wall", wall);
                    routePromises.push(route.save());
                });

                Parse.Promise.when(routePromises).then(function(){
                    wall.save({
                        success: function(result){
                            callback(result);
                        },
                        error: function(wall, error){
                            callback(result);
                        }
                    });
                });
            },

            //Take Down Routes on Wall
            takeDownRoutes: function(wall, callback){
                //First Give each Route a Taken Down Date.
                var routePromises = [];
                wall.attributes.routes.forEach(function(route){
                    var today = new Date();
                    route.set("takenDown", today);
                    routePromises.push(route.save());
                });

                Parse.Promise.when(routePromises).then(function(){
                    wall.set("routes", []);
                    wall.save({
                        success: function(wall){
                            callback(wall);
                        },
                        error: function(wall, error){
                            callback(error);
                        }
                    });
                });
            },



            //***** Routes ******//

            //Get Routes
            getRoutes: function(callback){
                var query = new Parse.Query("Route");
                query.include("setter");
                query.include("wall");
                query.limit(1000);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get Route By Id
            getRouteById: function(id, callback){
                var query = new Parse.Query("Route");
                query.include("setter");
                query.include("holds");
                query.include("wall");
                query.get(id, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(object, error){
                        console.log(error.message);
                        callback(error);
                    }
                });
            },

            //Get Route By User
            getRoutesByUser: function(user, callback){
                var query = new Parse.Query("Route");
                query.equalTo("setter", user);
                query.limit(1000);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        console.log(error.message);
                        callback(error);
                    }
                });
            },



            //Create Route
            createRoute: function(){
                var user = Parse.User.current();
                var gym = user.get('currentGym');
                var route = new Route();
                route.set("name", "");
                route.set("grade", "");
                route.set("color", "");
                route.set("setterComments", "");
                route.set("status", "0");
                route.set("createdBy", user);
                route.set("gymCreatedAt", gym);
                route.set("holds", []);
                route.set("crimps", "0");
                route.set("jugs", "0");
                route.set("pinches", "0");
                route.set("slopers", "0");
                route.set("edges", "0");
                route.set("volumes", "0");

                return route;
            },


            //Save Route
            saveRoute: function(route, callback){
                console.log("saving");
                //First Set Everything
                switch(route.attributes.color){
                case "gray":
                    route.attributes.order = 0;
                    break;
                case "yellow":
                    route.attributes.order = 1;
                    break;
                case "green":
                    route.attributes.order = 2;
                    break;
                case "red":
                    route.attributes.order = 3;
                    break;
                case "blue":
                    route.attributes.order = 4;
                    break;
                case "orange":
                    route.attributes.order = 5;
                    break;
                case "purple":
                    route.attributes.order = 6;
                    break;
                case "black":
                    route.attributes.order = 7;
                    break;
                };

                for(var attr in route.attributes) {
                    route.set(attr, route.attributes[attr]);
                }

                return route.save({
                    success: function(route){
                        //If the Route's current Wall is different, remove it from that Wall
                        if(route.attributes.wall){
                            var routeIds = [];
                            route.attributes.wall.attributes.routes.forEach(function(route){
                                routeIds.push(route.id);
                            });
                        } else {
                            route.save({
                                success: function(route){
                                    callback(route);
                                },
                                error: function(route, error){
                                    callback(error);
                                }
                            });
                        }
                        if(route.attributes.wall && ($.inArray(route.id, routeIds) == -1)){
                            console.log("route in different wall");
                            var query = new Parse.Query("Wall");
                            query.equalTo("routes", route);
                            query.first({
                                success: function(wall){
                                    if(wall){
                                        wall.remove("routes", route);
                                        wall.save({
                                            success: function(wall){
                                                //If Route has a Wall set, add it to the Wall, if Wall doesn't already have it
                                                if(route.attributes.wall){
                                                    route.attributes.wall.add("routes", route);
                                                    route.attributes.wall.save({
                                                        success: function(wall){
                                                            route.save({
                                                                success: function(route){
                                                                    callback(route);
                                                                },
                                                                error: function(route, error){
                                                                    callback(error);
                                                                }
                                                            });
                                                        },
                                                        error: function(route, error){
                                                            callback(error);
                                                        }
                                                    });
                                                } else {
                                                    route.save({
                                                        success: function(route){
                                                            callback(route);
                                                        },
                                                        error: function(route, error){
                                                            callback(error);
                                                        }
                                                    });
                                                }
                                            },
                                            error: function(wall, error){
                                                callback(error);
                                            }
                                        });
                                    } else {
                                        console.log("didn't find wall");
                                        if(route.attributes.wall){
                                            route.attributes.wall.add("routes", route);
                                            route.attributes.wall.save({
                                                success: function(wall){
                                                    route.save({
                                                        success: function(route){
                                                            callback(route);
                                                        },
                                                        error: function(route, error){
                                                            callback(error);
                                                        }
                                                    });
                                                },
                                                error: function(route, error){
                                                    callback(error);
                                                }
                                            });
                                        } else {
                                            route.save({
                                                success: function(route){
                                                    callback(route);
                                                },
                                                error: function(route, error){
                                                    callback(error);
                                                }
                                            });
                                        }
                                    }
                                },
                                error: function(error){
                                    callback(error);
                                }
                            });
                        } else {
                            console.log("route has same wall");
                            //Route has same wall
                            //If Route has a Wall set, add it to the Wall, if Wall doesn't already have it
                            if(route.attributes.wall && ($.inArray(route.id, routeIds) == -1)){
                                route.attributes.wall.add("routes", route);
                                route.attributes.wall.save({
                                    success: function(wall){
                                        route.save({
                                            success: function(route){
                                                callback(route);
                                            },
                                            error: function(route, error){
                                                callback(error);
                                            }
                                        });
                                    },
                                    error: function(route, error){
                                        callback(error);
                                    }
                                });
                            } else {
                                route.save({
                                    success: function(route){
                                        callback(route);
                                    },
                                    error: function(route, error){
                                        callback(error);
                                    }
                                });
                            }
                        }
                    }
                });
            },

            //Delete Route
            deleteRoute: function(route, callback){
                var query = new Parse.Query("Wall");
                query.equalTo("routes", route);
                query.first({
                    success: function(wall){
                        if(wall){
                            wall.remove("routes", route);
                            wall.save({
                                success: function(wall){
                                    route.destroy({
                                        success: function(result){
                                            callback(result);
                                        },
                                        error: function(object, error){
                                            callback(error);
                                        }
                                    });
                                },
                                error: function(wall, error){
                                    callback(error);
                                }
                            });
                        } else {
                            route.destroy({
                                success: function(result){
                                    callback(result);
                                },
                                error: function(object, error){
                                    callback(error);
                                }
                            });
                        }
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //***** Holds ******//


            //Get Holds
            getHolds: function(callback){
                var query = new Parse.Query("Hold");
                query.limit(1000);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get Hold By Id
            getHoldById: function(id, callback){
                var query = new Parse.Query("Hold");
                query.get(id, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(object, error){
                        console.log(error.message);
                        callback(error);
                    }
                });
            },


            //Create Hold
            createHold: function(){
                var user = Parse.User.current();
                var hold = new Hold();
                hold.set("name", "");
                hold.set("size", "");
                hold.set("type", "");
                hold.set("holdId", "");
                hold.set("color", "");
                hold.set("description", "");
                hold.set("createdBy", user);
                hold.set("gymCreatedAt", user.get('currentGym'));

                return hold;
            },

            //********* Users ***********//

            //Get All Users
            getUsers: function(callback){
                var query = new Parse.Query("User");
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get Users by Gym
            getUsersByGym: function(gym, callback){
                var query = new Parse.Query("User");
                query.equalTo("currentGym", gym);
                query.find({
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Get User by Id
            getUserById: function(id, callback){
                var query = new Parse.Query("User");
                query.get(id, {
                    success: function(results){
                        callback(results);
                    },
                    error: function(error){
                        callback(error);
                    }
                });
            },

            //Delete User
            deleteUser: function(user, callback){
                //var query = new Parse.Query("User");
            },


            //Auto Generate Routes
            autoGenRoutes: function(gym, number, callback){
                var routes = [];
                gym.attributes.walls.forEach(function(wall){
                    wall.attributes.routes.forEach(function(route){
                        routes.push(route);
                    });
                });

                var v0 = {}; v0.gray = 0; v0.yellow = 0;
                var v1 = {}; v1.yellow = 0;
                var v2 = {}; v2.yellow = 0; v2.green = 0;
                var v3 = {}; v3.green = 0; v3.red = 0;
                var v4 = {}; v4.green = 0; v4.red = 0; v4.blue = 0;
                var v5 = {}; v5.red = 0; v5.blue = 0; v5.orange = 0;
                var v6 = {}; v6.blue = 0; v6.orange = 0; v6.purple = 0;
                var v7 = {}; v7.orange = 0; v7.purple = 0;
                var v8 = {}; v8.purple = 0; v8.black = 0;
                var v9 = {}; v9.black = 0;
                var v10 = {}; v10.black = 0;
                var v11 = {}; v11.black = 0;
                var v12 = {}; v12.black = 0;

                routes.forEach(function(route){
                    if(route){
                        switch(route.attributes.grade){
                        case "0":
                            if(route.attributes.color == "gray"){
                                v0.gray++;
                            } else if(route.attributes.color == "yellow"){
                                v0.yellow++;
                            }
                            break;
                        case "1":
                            v1.yellow++;
                            break;
                        case "2":
                            if(route.attributes.color == "yellow"){
                                v2.yellow++;
                            } else if(route.attributes.color == "green"){
                                v2.green++;
                            }
                            break;
                        case "3":
                            if(route.attributes.color == "yellow"){
                                v3.yellow++;
                            } else if(route.attributes.color == "green") {
                                v3.green++;
                            } else if(route.attributes.color == "red") {
                                v3.red++;
                            }
                            break;
                        case "4":
                            if(route.attributes.color == "blue"){
                                v4.blue++;
                            } else if(route.attributes.color == "green") {
                                v4.green++;
                            } else if(route.attributes.color == "red") {
                                v4.red++;
                            }
                            break;
                        case "5":
                            if(route.attributes.color == "blue"){
                                v5.blue++;
                            } else if(route.attributes.color == "orange") {
                                v5.orange++;
                            } else if(route.attributes.color == "red") {
                                v5.red++;
                            }
                            break;
                        case "6":
                            if(route.attributes.color == "blue"){
                                v6.blue++;
                            } else if(route.attributes.color == "orange") {
                                v6.orange++;
                            } else if(route.attributes.color == "purple") {
                                v6.purple++;
                            }
                            break;
                        case "7":
                            if(route.attributes.color == "purple"){
                                v7.purple++;
                            } else if(route.attributes.color == "orange") {
                                v7.orange++;
                            }
                            break;
                        case "8":
                            if(route.attributes.color == "purple"){
                                v8.purple++;
                            } else if(route.attributes.color == "black") {
                                v8.black++;
                            }
                            break;
                        case "9":
                            v9.black++;
                            break;
                        case "10":
                            v10.black++;
                            break;
                        case "11":
                            v11.black++;
                            break;
                        case "12":
                            v12.black++;
                            break;
                        };
                    }
                });

                //Now Subtract the Current Routes from the Idealistic
                var needed = {};
                needed.grayV0 = gym.attributes.grayV0 - v0.gray;
                needed.yellowV0 = gym.attributes.yellowV0 - v0.yellow;
                needed.yellowV1 = gym.attributes.yellowV1 - v1.yellow;
                needed.yellowV2 = gym.attributes.yellowV2 - v2.yellow;
                needed.greenV2 = gym.attributes.greenV2 - v2.green;
                needed.greenV3 = gym.attributes.greenV3 - v3.green;
                needed.greenV4 = gym.attributes.greenV4 - v4.green;
                needed.redV3 = gym.attributes.redV3 - v3.red;
                needed.redV4 = gym.attributes.redV4 - v4.red;
                needed.redV5 = gym.attributes.redV5 - v5.red;
                needed.blueV4 = gym.attributes.blueV4 - v4.blue;
                needed.blueV5 = gym.attributes.blueV5 - v5.blue;
                needed.blueV6 = gym.attributes.blueV6 - v6.blue;
                needed.orangeV5 = gym.attributes.orangeV5 - v5.orange;
                needed.orangeV6 = gym.attributes.orangeV6 - v6.orange;
                needed.orangeV7 = gym.attributes.orangeV7 - v7.orange;
                needed.purpleV6 = gym.attributes.purpleV6 - v6.purple;
                needed.purpleV7 = gym.attributes.purpleV7 - v7.purple;
                needed.purpleV8 = gym.attributes.purpleV8 - v8.purple;

                needed.blackV8 = gym.attributes.blackV8 - v8.black;
                needed.blackV9 = gym.attributes.blackV9 - v9.black;
                needed.blackV10 = gym.attributes.blackV10 - v10.black;
                needed.blackV11 = gym.attributes.blackV11 - v11.black;
                needed.blackV12 = gym.attributes.blackV12 - v12.black;

                function randomIntFromInterval(min,max){
                    return Math.floor(Math.random()*(max-min+1)+min);
                };

                function createRoute(routeString){
                    var color = routeString.split("V")[0];
                    var grade = routeString.split("V")[1];

                    var route = ParseService.createRoute();
                    route.set("color", color);
                    route.set("grade", grade);
                    return route;
                };

                var routesCreated = [];

                for(var i = 0; i < number; i++){
                    var highest = "grayV0";
                    var contenders = [];
                    for(var attr in needed){
                        if(needed[highest] < needed[attr]){
                            highest = attr;
                            contenders = [];
                        } else if(needed[highest] == needed[attr]){
                            contenders.push(attr);
                        }
                    }

                    //If there are Routes with equal amounts needed, rando pick one
                    if(contenders.length > 0){
                        contenders.push(highest);
                        var rando = randomIntFromInterval(0, (contenders.length -1));
                        var selected = contenders[rando];
                        needed[selected]--;
                        routesCreated.push(createRoute(selected));

                    } else {
                        //Just Create Route, then subtract
                        needed[highest]--;
                        routesCreated.push(createRoute(highest));
                    }
                }
                callback(routesCreated);
            }
        };


        return ParseService;
    });
