import { Http,Headers ,RequestOptions} from '@angular/http';
import { request } from './models/request';
import { AngularFireDatabase } from 'angularfire2/database';
import { PickupCar } from './pickup-car/pickup-car';
import { CarProvider } from './../providers/car/car';
import { PickupDirective } from './../pickup/pickup';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { AvailbleCarDirective } from './available-cars/available-cars';
import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import { OneSignal } from '@ionic-native/onesignal';

declare var google;

@Component({
   selector: 'map',
  templateUrl: 'map.html',
   entryComponents: [PickupDirective,AvailbleCarDirective,PickupCar],
     providers:[CarProvider,PickupDirective]
})
export class MapDirective implements OnInit,OnChanges  {
    @Input() isPickupRequested:any;
    @Input() startstn:string;
    @Input() endstn:string;
    @Input() startLng:any;
    @Input() startLat:any;
    @Input() endLng:any;
    @Input() endLat:any;
    @Output() starting : EventEmitter<any>=new EventEmitter();
    @Output() ending : EventEmitter<any>=new EventEmitter();
    @Output() drag_second : EventEmitter<any>=new EventEmitter();
    public refreshing:boolean=false;
    public map:any;
    public isMapIdle:boolean;
    public currentLocation:any;
    public full="";
    lat:number;
    lng:number;
    tokenid:string;
    requestedRoute=[];
      items:any;
    Marker:any;
    MarkerEnd:any;
    MarkerStart:any;
     markerStart=[];
     request={} as request
     markerEnd=[];
    constructor(public loading:LoadingController,public platform:Platform, public http:Http, private dialog:Dialogs,public pick:PickupDirective,public geo:Geolocation,public afDatabase:AngularFireDatabase
  ){
//      
// 
   
 
     
   
     var data={
         "app_id": "2192c71b-49b9-4fe1-bee8-25617d89b4e8", 
  "include_player_ids": ["f474e684-6d7a-4546-810d-140a1c153b54"],
  "data": {"foo": "bar"},
  "contents": {"en": "한글 테스트"}
     }
     let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    if(this.platform.is('android')){
        
    }else{
        //  this.http.post('https://onesignal.com/api/v1/notifications', data, options).toPromise().then((res)=>{
        //     console.log(res.json())
        // }).catch((error)=>{
        //     alert(error);
        // })
    }
      
    //  let headers = new Headers({ 'Authorization': 'Bearer Xw8t8tVjgtT0t--jRrsD7oFqZEq2AFBIjF9XSwoqAuYAAAFdv6Kaqg' });
    // let options = new RequestOptions({ headers: headers });
    //   this.http.get('https://kapi.kakao.com/v1/user/me', options).toPromise().then((res)=>{
    //       console.log(res.json())
    //       alert(res.json());
    //   }).catch((error)=>{
    //     alert(error);
    // })
     
        // window["plugins"].OneSignal
        //                 .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
        //                 .handleNotificationOpened(notificationOpenedCallback)
        //                 .endInit();
  var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };
    //       window["plugins"].OneSignal
    // .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
  	// .handleNotificationOpened(notificationOpenedCallback)
    // .endInit();
 

        this.items=this.afDatabase.list('/requestedList/requested', { preserveSnapshot: true })
       this.items.subscribe(snapshots=>{
        console.log("snapshot????????????????????????????")
        console.log(snapshots);
        snapshots.forEach(element => {
          console.log(element.key);
          console.log(element.val().startLat);
          console.log(element.val());
          this.requestedRoute.push({tokenId:element.val().tokenId,key:element.key ,endLng:element.val().endLng,user:element.val().user,endLat:element.val().endLat ,lat:element.val().startLat,lng:element.val().startLng,create_date:element.val().create_date, startPoint:element.val().startPoint,endPoint:element.val().endPoint,status:element.val().status},
          {lat:element.val().endLat,lng:element.val().endLng,create_date:element.val().create_date, startPoint:element.val().startPoint,endPoint:element.val().endPoint,status:element.val().status})
          console.log(this.requestedRoute);
          console.log(this.requestedRoute.length);
          console.log(this.requestedRoute[0])
           console.log(this.requestedRoute[1])

           var j=1;
            for(var i=0; i<this.requestedRoute.length; i++){
            console.log(i);
               
                if(i%2!=0){
                     let newRoute=[];
                newRoute.push(this.requestedRoute[(i-1)])
                newRoute.push(this.requestedRoute[i])
                console.log(newRoute);
                let flightPath = new google.maps.Polyline({
                path: newRoute,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
                });

                flightPath.setMap(this.map);

                let Marker=new google.maps.Marker({
                    map : this.map,
                    position:this.requestedRoute[(i-1)],
                    icon:'assets/icon/start.png'
                })
                this.markerStart.push(Marker)
                let popup=new google.maps.InfoWindow({
                    content:'<p> 출발역 : '+this.requestedRoute[(i-1)].startPoint+'</p><p>도착역 :'+this.requestedRoute[(i-1)].endPoint+'</p><p> 발생일 : '+this.requestedRoute[(i-1)].create_date+'</p> <button id="myid" value="'+this.requestedRoute[(i-1)].key+'$'+this.requestedRoute[(i-1)].startPoint+'$'+this.requestedRoute[(i-1)].endPoint+'$'+this.requestedRoute[(i-1)].lat+'$'+this.requestedRoute[(i-1)].lng+'$'+this.requestedRoute[(i-1)].endLat+'$'+this.requestedRoute[(i-1)].endLng+'$'+this.requestedRoute[(i-1)].create_date+'$'+this.requestedRoute[(i-1)].tokenId+'$'+this.requestedRoute[(i-1)].user+'">신청</button>'
                });
              
                Marker.addListener('click',()=>{
                    popup.open(this.map,Marker);
                })
                 google.maps.event.addListenerOnce(popup, 'domready', () => {
                    document.getElementById('myid').addEventListener('click', () => {
                       var complex=(<HTMLInputElement>document.getElementById('myid')).value;
                       var key=complex.split("$")[0];
                       var startPoint=complex.split("$")[1];
                       var endPoint=complex.split("$")[2];
                       var startLat=complex.split("$")[3];
                       var startLng=complex.split("$")[4];
                       var endLat=complex.split("$")[5];
                       var endLng=complex.split("$")[6];
                       var create_date=complex.split("$")[7];
                       var tokenId=complex.split("$")[8];
                       var user=complex.split("$")[9];
                       
                        this.dialog.confirm("배달 신청하시겠습니까?", "확인").then((y)=>{
                            console.log("yessss"+y)
                        }).catch((n)=>{
                            console.log("nooo"+n)
                        })
                        var data=this.afDatabase.list('/requestedList/requested/'+key);
                        console.log(data);
                        console.log(this.request);
                        this.request.create_date=create_date;
                        this.request.startPoint=startPoint;
                        this.request.endPoint=endPoint;
                        this.request.startLat=parseInt(startLat);
                        this.request.endLat=parseInt(endLat);
                        this.request.endLng=parseInt(endLng);
                        this.request.startLng=parseInt(startLng);
                        this.request.user="ksks";
                        this.request.status="assigned";
                         this.afDatabase.list('/requestedList/assigned').push(this.request);

                         this.afDatabase.list('/requestedList/requested/'+key).remove();
                        var notificationObj = { contents: {en:"delivered"},
                                            include_player_ids: [tokenId]};
                        window["plugins"].OneSignal.postNotification(notificationObj,
                        function(successResponse) {
                        alert(successResponse);
                        },
                        function (failedResponse) {
                        console.log("Notification Post Failed: ", failedResponse);
                        alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
                        }
                    );
                    });
                });

                let MarkerEnd=new google.maps.Marker({
                    map : this.map,
                    position:this.requestedRoute[i],
                    icon:'assets/icon/end.png'
                })
                
                this.markerEnd.push(MarkerEnd)
                }
           
        }
        });
    })
    }
    dragging(trigger){
        console.log("dragged"+trigger);
        if(trigger){
            this.drag_second.next(true);    
        }else{
            this.drag_second.next(false);
        }
    }
    
    createMarkerForStart(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/start.png'
        })
        this.markerStart.push(this.Marker)
        if(this.markerStart.length>1){
            for(var i=0; i<this.markerStart.length; i++){

                if(this.markerStart.length-1==i){

                }else{
                    this.markerStart[i].setMap(null);
                }
            }
        }
    }
    createMarkerForEnd(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/end.png'
        })
        this.markerEnd.push(this.Marker)
        
                  var flightPlanCoordinates=[
           
        ];
        
        console.log(this.markerEnd);
        if(this.markerEnd.length>1){
            for(var i=0; i<this.markerEnd.length; i++){

                if(this.markerEnd.length-1==i){
                    
                }else{
                    this.markerEnd[i].setMap(null);
                }
            }
        }
    }
    ngOnChanges() {
        if(this.startLat!=undefined||this.startLat!=null){
            var location={lat:this.startLat,lng:this.startLng};
            this.centerLocation(location);
            this.createMarkerForStart(location);
            
        }

        if(this.endLat!=undefined||this.endLat!=null){
            var location={lat:this.endLat,lng:this.endLng};
            this.centerLocation(location);
            this.createMarkerForEnd(location);
           
        }

        console.log("ngChange!!!!!!!in map " +this.startLat+","+this.startLng);
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add 'implements OnChanges' to the class.
        console.log("map changed");
        console.log(this.startstn+","+this.endstn);
        if(this.startstn!=null||this.startstn!=undefined){
            console.log("map changed2");
            this.starting.next(this.startstn);
        }
        if(this.endstn!=null||this.endstn!=undefined){
            console.log("map changed2");
            this.ending.next(this.endstn);
        }
        
    }
    calling(){

    }
    
    ngOnInit(){
         this.map=this.createMap();
        this.getCurrentLocation2().subscribe(currentLocation=>{
           
        });
         
        
    }
        
centerLocation(location){
    if(location){
      
        this.map.panTo(location);
    }else{
        console.log("refreshing")
        this.pick.removePickupMarker();
        this.isMapIdle=false;
        this.getCurrentLocation2().subscribe(currentLocation=>{
        console.log("s"+currentLocation);
         this.map.panTo(currentLocation);    
            
        });
    }
  }
  
  updatedPickupLocation(location){
    this.currentLocation=location;
    this.centerLocation(location);
  }
  addMapEventListener(){
    // google.maps.event.addListener(this.map,'dragstart',(event)=>{
    //     console.log("addMapEventListener dragging"+event);
    //     this.isMapIdle=false;
    // })
    // google.maps.event.addListener(this.map,'idle',(event)=>{
    //     console.log("idle"+event);
    //     console.log(this.refreshing);
    //     if(this.refreshing){
    //         this.refreshing=false;
    //     }
    //     this.isMapIdle=true;
      
    // })

    // google.maps.event.addListener(this.map,'mouseup',(event)=>{
    //     console.log("mouseup????????????"+event.latLng.lat()+","+event.latLng.lng());
    //     console.log(event);
    //     this.getGeoCoding(event.latLng.lat(),event.latLng.lng());
        
    //     this.lat=event.latLng.lat();
    //     this.lng=event.latLng.lng();
    //     this.isMapIdle=true;
    // })

   
  }
    createMap(location=new google.maps.LatLng(37.5665,126.9780)){
        let mapOptions={
            center:location,
            zoom:15,
            disableDefaultUI: false
        }
        let mapEl=document.getElementById('map');
        let map=new google.maps.Map(mapEl,mapOptions);
        
        return map;
    }
      getCurrentLocation2(){
    let loading=this.loading.create({
      content:'위치정보를 받아오는 중...'
    })
    loading.present().then(()=>{
    })
    let options={timeout:5000,maximumAge :5000,enableHighAccuracy:true}
    let locationObs=Observable.create(observable =>{
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      let location=new google.maps.LatLng(lat,lng);
      this.map.panTo(location);
      loading.dismiss();
    }).catch((error =>{
        //position error 발생시 다시 위치 추척
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      let location=new google.maps.LatLng(lat,lng);
      this.map.panTo(location);
      loading.dismiss()
        })
    }))
    
    })
    return locationObs
  }
}