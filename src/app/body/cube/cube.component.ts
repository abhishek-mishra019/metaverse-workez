import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from "three";
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Color } from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;
//input() was used in tutorials 
  public rotationSpeedY: number = 0.01;
  public rotationSpeedX: number = 0.01;
  public size: number = 200;
  public cameraZ: number = 0.400;
  public fieldOfView: number = 75;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  private camera !: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private geometry = new THREE.BoxGeometry(1, 1, 1);
    private maerial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.maerial);
  private renderer !: THREE.WebGLRenderer;
  private scene  !: THREE.Scene;

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    const axesHelper = new THREE.GridHelper(5);
    this.scene.add(axesHelper);
    const directionalLight = new THREE.DirectionalLight(0xff0000);
    this.scene.add(directionalLight);
    const directionalLight1 = new THREE.DirectionalLight(0x0000ff);
    directionalLight1.position.set(1, 1, 1);
    this.scene.add(directionalLight1);
    this.scene.add(this.cube);
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, aspectRatio, this.nearClippingPlane, this.farClippingPlane)
    this.camera.position.set(0, 0, 4)
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.update();
    console.log(this.scene);
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }


  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }())
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

}
