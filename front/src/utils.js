import $ from 'jquery'; 
import Cookies from 'js-cookie';

class Utils {
    static post(r){
	r.type = "POST";
	this.req(r);
    }

    static get(r){
	r.type = "GET";
	this.req(r);
    }
    static del(r){
	r.type = "DELETE";
	this.req(r);
    }

    static req(r){
	$.ajax({ url: Cookies.get("server") + r.route
		 , headers: { 
		     'Content-Type': 'application/json',
		     'Authorization': 'Bearer '
			 + Cookies.get("jwt")
		 }
		 , type: r.type
		 , dataType: "json"
		 , data: JSON.stringify(r.data)
		 , success: r.success
		 , error: r.error
		 , async: true
	       });
    }

    static sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
    }

    static listToDict(xs, ks, vs){
	var r = {};
	for(var i = 0; i < xs.length; i++){
	    r[ks(xs[i])] = vs(xs[i]);
	}
	return r;
    }

    static formatTime(s){
	return new Date(s).toLocaleString("ru");
    }

    static myEmail(){
	return JSON.parse(Cookies.get("me")).email;
    }
}

export default Utils;
