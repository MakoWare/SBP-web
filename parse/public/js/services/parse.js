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

                route.save({
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

            //Delet User
            deleteUser: function(user, callback){
                //var query = new Parse.Query("User");
            },




        };
        return ParseService;
    });
