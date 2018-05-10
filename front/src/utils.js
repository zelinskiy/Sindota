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
	       });
    }

    static sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default Utils;
