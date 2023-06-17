import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as MY_TASKS_MODELS from '@modules/my-tasks/models/my-tasks.model';
import * as MY_TASKS_ACTIONS from '@modules/my-tasks/state/my-tasks.actions';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Store } from '@ngxs/store';
import { SSAConfigInst } from 'src/app/config/app.config';
import { SuccessSnackbar } from '@modules/my-tasks/models/my-tasks.config';
import { DecimalPipe } from '@angular/common';
import { map, startWith, filter } from 'rxjs/operators';
import { MyTasksService } from '@modules/my-tasks/models/my-tasks.service';



@Component({
  selector: 'ssa-injectable-form',
  templateUrl: './injectable-form.component.html',
  styleUrls: ['./injectable-form.component.scss'],
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class InjectableFormComponent implements OnInit {

  public injectableFieldsForm: FormGroup;
  public saveInjectableFieldsForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };
  public fileError: string;
  public directLead: MY_TASKS_MODELS.ChoiceModel[]
  public levels: MY_TASKS_MODELS.ChoiceModel[]
  public salaryLevels: MY_TASKS_MODELS.ChoiceModel[]
  public fileNames: {name:string; size:number}[] = [];
  public files: string[] = []
  public multipleFilesError: string;
  public totalMultipleFilesMaxSize:number = 0;
  public formActions: MY_TASKS_MODELS.InjectableDataModel[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: {
      injectedFields: MY_TASKS_MODELS.InjectableDataModel[],
      record: MY_TASKS_MODELS.MyTasksModel,
      action: string
    },
    private _snackbarService: SnackBarsService,
    private _dialogRef: MatDialogRef<InjectableFormComponent>,
    private _store: Store,
    private _myTasksService: MyTasksService,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._setRequiredFields()
    this._setDisabledFields();
    this._setFilteredData();
  }

  public onSelectMultipleFiles(event, injectedField: MY_TASKS_MODELS.InjectableDataModel) {

    if (event.target.files && event.target.files.length) {
      const max_size = injectedField.maxSize_Kb * 1024;
      const min_size = injectedField.minSize_Kb * 1024;
      const allowed_types = injectedField.allowedMimeTypes;
      // operation to calculate sum of upload files size
      let totalSum = 0;
      for (const key in event.target.files) {
        if (event.target.files[key].size)
          totalSum += event.target.files[key].size
      }
      if (injectedField?.maxSize_Kb && (totalSum + this.totalMultipleFilesMaxSize) > max_size ) {
        return this.multipleFilesError = `Maximum allowed file(s) size is ${injectedField.maxSize_Kb / 1024}MB`
      }
      for (let i = 0; i < event.target.files.length; i++) {
        if (event.target.files[i].size > max_size) {
          this.injectableFieldsForm.controls[injectedField.field].setValue(null);
          return this.multipleFilesError = `Maximum allowed file size is ${injectedField.maxSize_Kb / 1024}MB`
        }
        if (event.target.files[i].size < min_size) {
          this.injectableFieldsForm.controls[injectedField.field].setValue(null);
          return this.multipleFilesError = `Minimum allowed file size is ${injectedField.minSize_Kb / 1024}MB`
        }
        if (!allowed_types.includes(event.target.files[i].type)) {
          this.injectableFieldsForm.controls[injectedField.field].setValue(null);
          return this.multipleFilesError = `Only allowed file formats are ${injectedField.allowedExtensions.join(" , ")}`
        }

        this.fileNames.push({name: event.target.files[i].name, size:event.target.files[i].size})
      }
      const files = [...event.target.files];
      this._toBase64Handler(files).then((data) => {
        this.multipleFilesError = null;
        data.forEach((x, i) => {
          
          this.files.push(event.target.files[i].name + '%' + x.selectedFile)
        })
        this.injectableFieldsForm.controls[injectedField.field].setValue(this.files);
        this.totalMultipleFilesMaxSize += totalSum;
      })
      return;
    }

  }

  public removeFiles(i: number, injectedField: MY_TASKS_MODELS.InjectableDataModel) {
    this.totalMultipleFilesMaxSize -= this.fileNames[i].size;
    this.files.splice(i, 1)
    this.fileNames.splice(i, 1);
    this.injectableFieldsForm.controls[injectedField.field].setValue(this.files);

  }

  public onFileChange(event, injectedField: MY_TASKS_MODELS.InjectableDataModel) {


    if (event.target.files && event.target.files.length) {
      const max_size = injectedField.maxSize_Kb * 1024;
      const min_size = injectedField.minSize_Kb * 1024;
      const allowed_types = injectedField.allowedMimeTypes;

      if (event.target.files[0].size > max_size) {
        this.injectableFieldsForm.controls[injectedField.field].setValue(null);
        return this.fileError = `Maximum allowed file size is ${injectedField.maxSize_Kb / 1024}MB`
      }
      if (event.target.files[0].size < min_size) {
        this.injectableFieldsForm.controls[injectedField.field].setValue(null);
        return this.fileError = `Minimum allowed file size is ${injectedField.minSize_Kb / 1024}MB`
      }
      if (!allowed_types.includes(event.target.files[0].type)) {
        this.injectableFieldsForm.controls[injectedField.field].setValue(null);
        return this.fileError = `Only allowed file formats are ${injectedField.allowedExtensions.join(" , ")}`
      }


      const [file] = event.target.files;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (e) => {
        this.fileError = null;
        this.injectableFieldsForm.controls[injectedField.field].setValue(reader.result);

      };

      return;
    }

  }

  public onSelectDate(date: Date, injectedField?: MY_TASKS_MODELS.InjectableDataModel) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T00:00:00.000Z";
    if (injectedField && injectedField.field) {
      this.injectableFieldsForm.controls[injectedField.field].setValue(formattedDate)
      if (injectedField.requiredReload) {
        this.takeSoftAction(injectedField)
      }
    } else {
      return formattedDate
    }

  }


  // public onJobSelect(choice) {
  //   console.log(choice)
  //   console.log(this.config.injectedFields)
  //   this.injectableFieldsForm.controls.LevelId.enable()
  //   this.injectableFieldsForm.controls.LevelId.setValue('')
  //   this.injectableFieldsForm.controls.SalaryLevelId.setValue('')
  // }


  public toString(dataObject) {
    Object.keys(dataObject).forEach(key => {
      if (dataObject[key] && dataObject[key] instanceof Array) {
        const modifiedKeys = dataObject[key].map((element) => { return `"${element}"` })
        dataObject[key] = `[${modifiedKeys}]`;
      }
      else {
        if (key === 'NewTenroxGroup') {
          //! this line to not trim the value 
          dataObject[key] = dataObject[key]?.toString() ? '' + dataObject[key].toString() : null;
        } else {

          dataObject[key] = dataObject[key]?.toString() ? '' + dataObject[key].toString().trim() : null;
        }
      }
    });
    return dataObject;
  }

  public submit() {
    console.log(this.injectableFieldsForm.getRawValue())
    const formValue = { ...this.injectableFieldsForm.getRawValue() }
    Object.entries(formValue).forEach(([key, value]) => {
      if (value instanceof Object && 'id' in value) {
        formValue[key] = value['id']
      }
    })
    const takeActionParameter: MY_TASKS_MODELS.ActionConfigsModel = {
      requestId: this.config.record.id,
      choice: this.config.action.toUpperCase(),
      injectedData: this.toString(formValue)
    }
    this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionOnTask(takeActionParameter)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
        duration: 5,
        showCloseBtn: false
      });
      this._dialogRef.close('closed');
    })
  }

  public checkValidity(ev, formControl: string) {
    if (ev.value.trim() === '') {
      this.injectableFieldsForm.controls[formControl].markAsTouched()
    }
  }

  public addValueToInjectableFormField(list: any[], injectedFieldFormControl) {
    injectedFieldFormControl.selectedValues = [...list];
    this.injectableFieldsForm.controls[injectedFieldFormControl.field].patchValue(list.map(item => item.id))
    this.injectableFieldsForm.controls[injectedFieldFormControl.field].patchValue(list.map(item => item.id))
  }
  public removeItemFromList(removedValue, injectedField) {
    injectedField.selectedValues = injectedField.selectedValues.filter(item => item.id !== removedValue.id);
    this.injectableFieldsForm.controls[injectedField.field].patchValue(injectedField.selectedValues.map(item => item.id))
    if (!injectedField.selectedValues.length) {
      this.injectableFieldsForm.controls[injectedField.field].setValue(null);
      this.injectableFieldsForm.controls[injectedField.field].markAllAsTouched();
    }
  }

  public cancel() {
    this._dialogRef.close();
  }

  public displayFn(item: MY_TASKS_MODELS.ChoiceModel): string {
    return item && item.displayName ? item.displayName : '';
  }


  public takeInjectedAction(action: MY_TASKS_MODELS.InjectableDataModel){
    let injectedAction = {...this.prepareFormBody(),actionTaken: action.action};
    this._store.dispatch(new MY_TASKS_ACTIONS.TakeInjectedAction(injectedAction)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(injectedAction.choice)]("Your Task"),
        duration: 5,
        showCloseBtn: false
      });
      this._dialogRef.close('closed');
    })
  }

  public onCheckRequiredReloadedValidity(injectedField: MY_TASKS_MODELS.InjectableDataModel): void {
    if (injectedField.requiredReload) {
      this.takeSoftAction(injectedField)
    }
  }

  // to open the dependant fields
  public takeSoftAction(injectedField?: MY_TASKS_MODELS.InjectableDataModel): void {
    const formValue = { ...this.injectableFieldsForm.getRawValue() }
    Object.entries(formValue).forEach(([key, value]) => {
      if (value instanceof Object && 'id' in value) {
        formValue[key] = value['id']
      }
    })
    const takeActionParameter: MY_TASKS_MODELS.ActionConfigsModel = {
      requestId: this.config.record.id,
      choice: this.config.action.toUpperCase(),
      injectedData: this.toString(formValue),
      changedFieldName: injectedField.field
    }
    this._myTasksService.takeSoftAction(takeActionParameter).subscribe(
      (res: MY_TASKS_MODELS.InjectableDataModel[]) => {
        if (!res.length) {
          this._store.dispatch(new MY_TASKS_ACTIONS.TakeActionOnTask(takeActionParameter)).subscribe(() => {
            // this._snackbarService.openSuccessSnackbar({
            //   message: SSAConfigInst.CRUD_CONFIG.successMessages[SuccessSnackbar(takeActionParameter.choice)]("Your Task"),
            //   duration: 5,
            //   showCloseBtn: false
            // });
          })
        }

        this.config.injectedFields = res
        this._initForm()
        this._setRequiredFields()
        this._setDisabledFields()
      }
    )
  }

  private _filter(value: string, options: MY_TASKS_MODELS.ChoiceModel[] | any[]): string[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return options.filter(option => option.displayName.toLowerCase().includes(filterValue));
  }

  private _initForm() {
    this.formActions = []
    let group = {}
    this.config.injectedFields.forEach((injectedField) => {
      group[injectedField.field] = injectedField.type === 5 && injectedField.value ?
        new FormControl({value: this.onSelectDate(new Date(injectedField.value)), disabled: injectedField.disabled})
        :
        injectedField.type === 9 ? new FormControl({value : injectedField.value.toLowerCase() === 'false' ? false : true, disabled: injectedField.disabled})
          : injectedField.type === 11 ?
            new FormControl({value: injectedField.value.toLowerCase() === 'true' ? true : false, disabled: injectedField.disabled})
            : injectedField.type === 1 ?
              new FormControl({ value: injectedField.value ? this._decimalPipe.transform(injectedField.value, '1.0-2').replace(/,/g, "") : injectedField.value, disabled: injectedField?.disabled })
              : new FormControl({value: injectedField.value, disabled: injectedField?.disabled})
    })
    this.injectableFieldsForm = new FormGroup(group);

    this.config.injectedFields.forEach((injectedField) => {
      if(injectedField.type === 7 && !injectedField.allowMulticheck ){
        let found = injectedField?.choices.find(item=> item.id === injectedField.value);
        if(!found) this.injectableFieldsForm.get(injectedField.field).setValue(null)
      }
      if (injectedField.type === 7 && injectedField.allowAutoComplete) {
        // autocomplete field
        if (injectedField.allowMulticheck) {
          if (injectedField.value) {
            // parsing value from string to array
            let arr = JSON.parse(injectedField.value);
            injectedField.selectedValues = arr.map(item => {
              return injectedField.choices.find(choice => choice.id === item)
            })
          } else {
            this.injectableFieldsForm.controls[injectedField.field].patchValue(null)
          }
        }
        else {
          if (injectedField.value) {
            this.injectableFieldsForm.controls[injectedField.field].patchValue(injectedField.choices.find(choice => choice.id === injectedField.value))
          }
          injectedField.choicesAsync = this.injectableFieldsForm.controls[injectedField.field].valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '', injectedField.choices)),
          );
        }
      }
      else if (injectedField.type === 13){
        this.formActions.push(injectedField);
      }
      switch(injectedField.field) {
        case 'RoleId':
        case 'AccountManagerEmail':
        case 'NationalID':
        case 'Religion':
        case 'MaritalStatus':
        case 'MedicalCardState':
        case 'EmergencyContactName':
          injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
          break;
        case 'AccountManagerName':
        case 'SSN':
        case 'MilitaryStatus':
        case 'Birthdate':
        case 'EmergencyContactNumber':
        case 'CPLocationId':
          injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          break;
        case 'Gender':
          if(this.config.action === 'INJECT_JOIN_CANDIDATE_TO_FLAIRSUITE_DATA') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          }
          break;
        case 'SocialInsuranceNumber':
          if(this.config.action === 'INJECT_JOIN_CANDIDATE_TO_FLAIRSUITE_DATA') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          }
          break;
        case 'JoiningDate':
          if(this.config.action === 'INJECT_TEAM_MANAGER_ONBOARDING_DATA' || this.config.action === 'SKIP_TO_IT' || this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          } 
          break;
        case 'ServiceStartDate':
          if(this.config.action === 'INJECT_TEAM_MANAGER_ONBOARDING_DATA') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          } else if(this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
            injectedField.cssClass = 'w-full'
          } 
          break;
        case 'AccountId':
        case 'ProductId':
        case 'ExternalEmail':
          injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-2 w-full'
          break;
        case 'Title':
          if (this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
            injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-2 w-full'
          }
          else if (this.config.action === 'SKIP_TO_IT') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          }
          else if (this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
            injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
          }
          break;
        case 'ERBTeamId':
            injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-0 w-full'
          break;
        case 'CandidateFullName':
            if(this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
              injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-2 w-full'
          } 
          else if (this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT' || this.config.action === 'SKIP_TO_IT') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          } 
          break;
        case 'ContractType':
          if(this.config.action === 'INJECT_TEAM_MANAGER_ONBOARDING_DATA') {
            injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-2 w-full'
          } else if(this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
            injectedField.cssClass = 'w-full'
          }
          break;
        case 'PONumber':
          if(this.config.action === 'INJECT_TEAM_MANAGER_ONBOARDING_DATA') {
            injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-2 w-full'
          } else if(this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
            injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
          }
          break;
        case 'BillingRate':
          if(this.config.action === 'INJECT_TEAM_MANAGER_ONBOARDING_DATA') {
            injectedField.cssClass = 'md:w-1/3 small-form-control md:pr-0 w-full'
          } else if(this.config.action === 'INJECT_ASSOCIATE_EMPLOYEE_WITH_ACCOUNT_DATA') {
            injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
          }
          break;
        case 'NewJoiningDate': 
          if(this.config.action === 'INJECT_JOIN_CANDIDATE_TO_FLAIRSUITE_DATA') {
          injectedField.cssClass = 'md:w-3/4 float-left md:pr-2 w-full'
        } else if (this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
          injectedField.cssClass = 'md:w-1/2 float-right md:pl-2 w-full'
        }
          break;
        case 'IsEmploymentDateVerified': 
          injectedField.cssClass = 'md:w-1/5 float-right md:pl-2 mt-4 w-full'
          break;
        case 'ArabicDisplayName':
          if(this.config.action === 'INJECT_JOIN_CANDIDATE_TO_FLAIRSUITE_DATA') 
            injectedField.cssClass = 'md:w-1/2 form-control float-right md:pr-2 w-full'
          break;
        case 'Address':
        case 'ProfilePicture':
        case 'DirectLeadId':
        case 'UserToMinicEmail': 
        case 'OnboardingEmailTicketNote': 
        case 'RoleType': 
          injectedField.cssClass = 'w-full'
          break;
        case 'AssociationNote':
          injectedField.cssClass = 'flex-100'
        break;

        case 'IsEmployeeResourceBased':
        if (this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
          injectedField.cssClass = 'md:w-1/2 float-right md:pl-2 mt-10 w-full'
        } else {
          injectedField.cssClass = 'w-full'
        }
        break;
        case 'ServiceDeliveryManagerFullName':
        case 'PositionLocation': 
        injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
        break;
        case 'WorkSchedule': 
        if(this.config.action === 'SKIP_TO_IT'){
          injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
        } else if(this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
          injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
        }
        break;
        case 'PositionDepartmentName': 
        case 'FloorAccess':
        if(this.config.action === 'SKIP_TO_IT'){
         injectedField.cssClass = 'md:w-1/2 form-control float-right md:pl-2 w-full'
        } else if(this.config.action === 'INJECT_NEW_JOIN_DATE_ONBOARDING_DATA_AND_SEND_TO_IT') {
         injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
        }
        break;
        case 'AccountName': 
        case 'CandidatePhoneNumber': 
        injectedField.cssClass = 'md:w-1/2 form-control float-left md:pr-2 w-full'
        break;
      }
    })
  }

  /**
   * @summary to handle required fields regarding backend configs
   */
  private _setRequiredFields() {
    let validators: ValidatorFn[] = []
    this.config.injectedFields.forEach((injectedField) => {
      validators = [];
      if (injectedField.required) {
        validators.push(Validators.required)
      }
      if (injectedField?.requiredTrue) {
        validators.push(Validators.requiredTrue)
      }
      if (injectedField.maxLength) {
        validators.push(Validators.maxLength(injectedField.maxLength))
      }
      if (injectedField.minLength >= 0) {
        validators.push(Validators.minLength(injectedField.minLength))
      }
      if (injectedField.maxValue) {
        validators.push(Validators.max(injectedField.maxValue))
      }
      if (injectedField.minValue >= 0) {
        validators.push(Validators.min(injectedField.minValue))
      }
      if (injectedField.pattern) {
        validators.push(Validators.pattern(injectedField.pattern))
      }

      validators.push(Validators.pattern(/^$|.*\S+.*/))

      this.injectableFieldsForm.controls[injectedField.field].setValidators(validators)

    })
  }
  /**
   * @summary disable fields
   */

  private _setDisabledFields() {
    this.config.injectedFields.forEach((injectedField) => {
      const disabledFields = ['LevelId', 'SalaryLevelId' , 'ProductId','ERBTeamId']
      if (disabledFields.includes(injectedField.field) && injectedField.disabled) {
        this.injectableFieldsForm.controls[injectedField.field].disable()
      }
    })
  }


  private _setFilteredData() {
    this.config.injectedFields.forEach((injectedField) => {
      if (injectedField.field === 'LevelId' && injectedField.type === 7) {
        this.levels = injectedField.choices
      } else if (injectedField.field === 'SalaryLevelId' && injectedField.type === 7) {
        this.salaryLevels = injectedField.choices
      }

    })
  }

  private async _toBase64Handler(files) {
    const filePathsPromises = [];
    files.forEach(file => {
      filePathsPromises.push(this._toBase64(file));
    });
    const filePaths = await Promise.all(filePathsPromises);
    const mappedFiles = filePaths.map((base64File) => ({ selectedFile: base64File }));
    return mappedFiles;
  }


  private _toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  private prepareFormBody(){
    for (const controller in this.injectableFieldsForm.controls) {
      if(controller === 'null'){
        this.injectableFieldsForm.removeControl(controller)
      }
    }
    const formValue = { ...this.injectableFieldsForm.getRawValue() }
    Object.entries(formValue).forEach(([key, value],index) => {
      if (value instanceof Object && 'id' in value && key) {
        formValue[key] = value['id']
      }
    })
    return {
      requestId: this.config.record.id,
      choice: this.config.action.toUpperCase(),
      injectedData: this.toString(formValue)
    }
  }

}
