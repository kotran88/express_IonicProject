import { AngularFireDatabase } from 'angularfire2/database';
import { PickupCar } from './pickup-car/pickup-car';
import { CarProvider } from './../providers/car/car';
import { PickupDirective } from './../pickup/pickup';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AvailbleCarDirective } from './available-cars/available-cars';
import { Geolocation } from '@ionic-native/geolocation';
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
    requestedRoute=[];
      items:any;
    Marker:any;
     markerStart=[];
     markerEnd=[];
    constructor(public loading:LoadingController,public pick:PickupDirective,public geo:Geolocation,public afDatabase:AngularFireDatabase
  ){
        this.items=this.afDatabase.list('/requestedList/requested', { preserveSnapshot: true })
       this.items.subscribe(snapshots=>{
        console.log("snapshot????????????????????????????")
        console.log(snapshots);
        snapshots.forEach(element => {
          console.log(element.key);
          console.log(element.val().startLat);
          this.requestedRoute.push({lat:element.val().startLat,lng:element.val().startLng},{lat:element.val().endLat,lng:element.val().endLng})
          console.log(this.requestedRoute);
          console.log(this.requestedRoute.length);
          console.log(this.requestedRoute[0])
           console.log(this.requestedRoute[1])


            for(var i=0; i<4; i++){
            console.log(i);
            if(i==1){
                //i가 1, 3, 5, 7
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                let newRoute=[];
                newRoute.push(this.requestedRoute[0])
                newRoute.push(this.requestedRoute[1])
                console.log(newRoute);
                let flightPath = new google.maps.Polyline({
                path: newRoute,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
                });

                flightPath.setMap(this.map);

                this.Marker=new google.maps.Marker({
                    map : this.map,
                    position:this.requestedRoute[0],
                    icon:'assets/icon/start.png'
                })
                this.markerStart.push(this.Marker)

                this.MarkerEnd=new google.maps.Marker({
                    map : this.map,
                    position:location,
                    icon:'assets/icon/end.png'
                })
                
                this.markerEnd.push(this.Marker)
            }
            if(i==3){
                let newRoute=[];
                newRoute.push(this.requestedRoute[2])
                newRoute.push(this.requestedRoute[3])
                console.log(newRoute);
                let flightPath = new google.maps.Polyline({
                path: newRoute,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
                });

                flightPath.setMap(this.map);
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
        this.addMapEventListener();
        this.getCurrentLocation2().subscribe(location=>{
      this.centerLocation(location)
        });
    }
    centerLocation_refresh(location){

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
            disableDefaultUI: true
        }
        let mapEl=document.getElementById('map');
        let map=new google.maps.Map(mapEl,mapOptions);
     
        
        return map;
    }
      getCurrentLocation2(){
    let loading=this.loading.create({
      content:'locating.......'
    })
    loading.present().then(()=>{
    })
    let options={timeout:5000,maximumAge :5000,enableHighAccuracy:true}
    let locationObs=Observable.create(observable =>{
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      console.log(lat+","+lng);
      console.log("11");
      let location=new google.maps.LatLng(lat,lng);
      this.map.panTo(location);
      loading.dismiss();
    }).catch((error =>{
        alert(error);
        loading.dismiss();
    }))
    
    })
    return locationObs
  }
}