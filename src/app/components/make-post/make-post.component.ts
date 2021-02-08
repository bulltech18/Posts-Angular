import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { title } from 'process';
import { Post, Post2 } from 'src/app/models/post';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Comentario, Comentario2 } from 'src/app/models/comment';

@Component({
  selector: 'app-make-post',
  templateUrl: './make-post.component.html',
  styleUrls: ['./make-post.component.css']
})
export class MakePostComponent implements OnInit {

  @ViewChild("myModalInfo", {static: false}) myModalInfo: TemplateRef<any>;
  post = new Post();
  posts: Post[] = [];
  posts2: Post2[] = [];
  token:string;
  bandera: boolean = false;
  bandera2: boolean = false;
  comment = new Comentario()
  comments: Comentario[] = [];
  coment2 = new Comentario2();

  constructor(private postService:AuthService, private modalService: NgbModal) { }


  
  ngOnInit(): void 
  {
    this.postService.show().subscribe(data => {this.posts2 = data["data"]; console.log(this.posts2)})

  }
  mostrarModalInfo(i:number){
    this.modalService.open(this.myModalInfo);
    console.log(`info post: ${this.posts2[i].id}`);
    const id = this.posts2[i].id
    
    this.postService.getComments(id).subscribe(data => {this.comments = data["data"]})
    console.log(id)

  }

  crear (ngform: NgForm)
  {
    const token = localStorage.getItem('token');
    const data: Post2 = 
    {
      "id": 0,
      "token": token,
      "title": ngform.control.value.title,
      "body": ngform.control.value.body
    }
    this.posts2.push(data)
    this.postService.post(data).subscribe((data:any) =>{
      Swal.fire({
        icon: 'success',
        title: 'Agregado con exito',
        showConfirmButton: false,
        timer: 1500
      })
    }, error => {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href>Why do I have this issue?</a>'
      })
    })

    
    

  }
  crearComentario (ngform: NgForm, i:number)
  {
    const token = localStorage.getItem('token');
    const data: Comentario = 
    {
      "token": token,
      "body": ngform.control.value.bodyC,
      "post_id": this.posts2[i].id
    }
    
    this.postService.makeComment(data).subscribe((data:any) =>{
      Swal.fire({
        icon: 'success',
        title: 'Agregado con exito',
        showConfirmButton: false,
        timer: 1500
      })
    }, error => {
    Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href>Why do I have this issue?</a>'
      })
    })

    
    

  }



  ocultar() 
  {
    if(this.bandera == false)
    {
      this.bandera = true;
    } 
    else 
    {
      this.bandera = false
    }
  }



  ocultarinfo() 
  {
    if(this.bandera2 == false)
    {
      this.bandera2 = true;
    } 
    else
     {
      this.bandera2 = false
    }
  }





  
}
