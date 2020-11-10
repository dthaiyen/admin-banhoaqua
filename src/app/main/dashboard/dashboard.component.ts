import { Component, OnInit, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/lib/base-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(private injector: Injector) { 
    super(injector)
  }
  tonkho:any;
  het:any;
  saphet:any;
  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      alert("gello");
      this._api.get("/api/thongke/Get_tonkho_Sanpham").subscribe(ress=>{
        this.tonkho  = ress;
      });
      this._api.get("/api/thongke/Get_Het_Sanpham").subscribe(ress=>{
        this.het  = ress;
      });
      this._api.get("/api/thongke/Get_Saphet_Sanpham").subscribe(ress=>{
        this.saphet  = ress;
        console.log(ress);
        
      });  
    })
  }

}
