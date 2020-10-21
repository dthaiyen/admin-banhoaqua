import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent extends BaseComponent implements OnInit {
  public products: any;
  public product: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  types:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'item_name': [''],
      'item_mota': [''],   
      'item_material': ['']    
    }); 
   this.search();
   this._api.get('/api/itemGroupAdmin/get-menu').takeUntil(this.unsubscribe).subscribe(res => {
    this.types = res;
  }); 
  }

  loadPage(page) { 
    this._api.post('/api/itemAdmin/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/itemAdmin/searchadmin',{page: this.page, pageSize: this.pageSize, item_name: this.formsearch.get('item_name').value, item_mota: this.formsearch.get('item_mota').value, item_material: this.formsearch.get('item_material').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }
  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           item_image:data_image,
           item_group_id:value.item_group_id,
           item_name:value.item_name,
           item_price:+value.item_price,
           item_mota:value.item_mota,
           item_material:value.item_material,
           item_width:value.item_width,
           item_height:value.item_height,
           item_depth:value.item_depth 
          };
          //debugger;
        this._api.post('/api/itemAdmin/create-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
           item_image:data_image,
           item_name:value.item_name,
           item_price:value.item_price,
           item_mota:value.item_mota,
           item_material:value.item_material,
           item_width:value.item_width,
           item_height:value.item_height,
           item_depth:value.item_depth,     
           item_id:this.product.item_id,          
          };
        this._api.post('/api/itemAdmin/update-item',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/itemAdmin/delete-item',{item_id:row.item_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.product = null;
    this.formdata = this.fb.group({
      'item_group_id': [''],
      'item_name': [''],
      'item_price': [''],
      'item_mota': [''],
      'item_material': [''],
      'item_width': [''],
      'item_height': [''],
      'item_depth': [''],
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.product = null;
    setTimeout(() => {
      $('#createItemModal').modal('toggle');
      this.formdata = this.fb.group({
      'item_group_id': [''],
      'item_name': [''],
      'item_price': [''],
      'item_color': [''],
      'item_material': [''],
      'item_width': [''],
      'item_height': [''],
      'item_depth': [''],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createItemModal').modal('toggle');
      this._api.get('/api/itemAdmin/get-by-id/'+ row.item_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.product = res; 
          this.formdata = this.fb.group({
            'item_group_id': [this.product.item_group_id],
            'item_name': [this.product.item_name],
            'item_price': [this.product.item_price],
            'item_color': [this.product.item_color],
            'item_material': [this.product.item_material],
            'item_width': [this.product.item_width],
            'item_height': [this.product.item_height],
            'item_depth': [this.product.item_depth]
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createItemModal').closest('.modal').modal('hide');
  }
}
