import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Image } from '../models/Image';
import { Camera } from '../models/Camera';
import { ip } from '../models/IpServer';
import { Observable } from 'rxjs';
import { Day } from 'src/app/models/Day';
import { Relation } from 'src/app/models/Relation';

@Injectable({
  providedIn: 'root'
})
export class FacesService {
API_URI = 'http://'+ ip +':3000/api';
API_FR = 'http://'+ ip +':3330/api';
  constructor(private http: HttpClient) { }

  info(info:any){
    return this.http.post(`${this.API_URI}/getInfo`, info);
  }

  doOneImage(camera_id:string){
    return this.http.get(`${this.API_URI}/cameraImages/${camera_id}`)
  }
  doAllImages(){
    return this.http.get(`${this.API_URI}/cameraImages/all`)
  }
  getFaces(){
    return this.http.get(`${this.API_URI}/face`);
  }
  getCount(age: string){
    return this.http.get(`${this.API_URI}/face/${age}`);
  }
  getCountAge(){
    return this.http.get(`${this.API_URI}/count`);
  }
  getCountEmotion(){
    return this.http.get(`${this.API_URI}/emotion`);
  }
  getSome(uuid: string){
    return this.http.get(`${this.API_URI}/images/${uuid}`);
  }
  getUsers(){
    return this.http.get(`${this.API_URI}/users`);
  }
  searchUsers(search:string){
    return this.http.get(`${this.API_URI}/users/search/${search}`);
  }
  getAlgos(){
    return this.http.get(`${this.API_URI}/algorithm`);
  }
  getUser(uuid: string){
    return this.http.get(`${this.API_URI}/users/${uuid}`);
  }
  deleteUser(uuid: string){
    return this.http.delete(`${this.API_URI}/users/${uuid}`);
  }
  deleteImage(id: number){
    return this.http.delete(`${this.API_URI}/images/${id}`);
  }
  deleteImageFile(name: string, user_id:string){
    return this.http.delete(`${this.API_URI}/delete/${user_id}/${name}`);
  }
  deleteAllImageFile(user_id:string){
    return this.http.delete(`${this.API_URI}/delAll/${user_id}`);
  }
  saveUser(user: User){
return this.http.post(`${this.API_URI}/users`, user);
  }
  saveImage(image: Image){
return this.http.post(`${this.API_URI}/images`, image);
  }
  updateUser(id: string|number, updateUser: User): Observable<User>{
    return this.http.put(`${this.API_URI}/users/${id}`, updateUser);
  }
  getCameras(){
    return this.http.get(`${this.API_URI}/cameras`);
  }
  getCamera(uuid: string){
    return this.http.get(`${this.API_URI}/cameras/${uuid}`);
  }
  deleteCamera(id: string){
    return this.http.delete(`${this.API_URI}/cameras/${id}`);
  }
  saveCamera(camera: Camera){
    return this.http.post(`${this.API_URI}/cameras`, camera);
  }
  updateCamera(id: string|number, updateCamera: Camera): Observable<Camera>{
    return this.http.put(`${this.API_URI}/cameras/${id}`, updateCamera);
  }
  getRelations(uuid: string){
    return this.http.get(`${this.API_URI}/relations/${uuid}`);
  }
  getAllRelations(){
    return this.http.get(`${this.API_URI}/rel`);
  }
  saveRelation(relation: Relation){
    return this.http.post(`${this.API_URI}/relations`, relation);
  }
  deleteRelation(algo_id: number){
    return this.http.delete(`${this.API_URI}/relations/${algo_id}`);
  }
  updateRelation(id: string, updateRelation: Relation): Observable<Relation>{
    return this.http.put(`${this.API_URI}/relations/${id}`, updateRelation);
  }
  signal(){
    return this.http.get(`${this.API_URI}/send`);
  }
  startfr(cams:any){
    return this.http.post(`${this.API_FR}/startfr`,cams);
  }
  stwb(){
    return this.http.get(`${this.API_FR}/stweb`);
  }
  stopfr(){
    return this.http.get(`${this.API_URI}/stopfr`);
  }
  feedstream(rtsp:string,port:number){
    return this.http.get(`${this.API_URI}/FeedWsStreaming/${port}/${rtsp}`);
  }
  startwsstream(){
    return this.http.get(`${this.API_URI}/StartWsStreaming/`);
  }
  startWsStream(data:any){
    return this.http.post(`${this.API_URI}/StartWsStreaming/`, data);
  }
  stopWsStream(data:any){
    return this.http.post(`${this.API_URI}/StopWsStreaming/`, data);
  }
  killwsstream(){
    return this.http.get(`${this.API_URI}/KillWsStreaming`);
  }
  startra(){
    return this.http.get(`${this.API_URI}/startra`);
  }
  stopra(){
    return this.http.get(`${this.API_URI}/stopra`);
  }
  gethm1(start: string, end:string, camera_id:string){
    return this.http.get(`${this.API_URI}/hm/first/${start}/${end}/${camera_id}`);
  }
  getdwell1(start: string, end:string, dwell:number, camera_id:string){
    return this.http.get(`${this.API_URI}/hm/first/${start}/${end}/${dwell}/${camera_id}`);
  }
  getallhm1(camera_id:string){
    return this.http.get(`${this.API_URI}/hm/first/${camera_id}`);
  }
  getzones(){
    return this.http.get(`${this.API_URI}/hm/zone`);
  }
  saveSchedule(day: Day){
   return this.http.post(`${this.API_URI}/schedule/`, day);
 }
 updateSchedule(day: Day){
   return this.http.put(`${this.API_URI}/schedule/${day.user_id}`, day);
 }
 getSchedule(day: Day){
   return this.http.get(`${this.API_URI}/schedule/${day.user_id}/${day.day}`);
 }
 getAllSchedule(user_id: number) {
    return this.http.get(`${this.API_URI}/schedule/${user_id}`);
 }
 deleteSchedule(user_id: number){
   return this.http.delete(`${this.API_URI}/schedule/${user_id}`);
 }
 deleteSomeImages(images:any, user_id:string){
  return this.http.delete(`${this.API_URI}/deleteSome/${user_id}/`, images);
}
  status(mod:number){
    return this.http.get(`${this.API_URI}/readStatus/${mod}/`);
  }
  killwsstreamffmpeg(ffmpeg_pid:number , number_port_use:number){
    return this.http.get(`${this.API_URI}/KillStreamingFFMPEG/${ffmpeg_pid}/${number_port_use}`);
  }
  killwsstreamws(ws_pid:number,port:number,server:boolean){
    return this.http.get(`${this.API_URI}/KillWsStreaming/${ws_pid}/${port}/${server}`);
  }
  getPorts(){
    return this.http.get(`${this.API_URI}/getPorts`);
  }
  updtCams(id:string,cam:any){
    return this.http.put(`${this.API_URI}/cameras/newRt/${id}`,cam);
  }
}
