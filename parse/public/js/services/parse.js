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


            //***** Routes ******//

            //Get Routes
            getRoutes: function(callback){
                var query = new Parse.Query("Route");
                query.include("setter");
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
                route.set("status", "Not Set");
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
