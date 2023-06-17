import { Component, OnInit, OnDestroy, ViewChild, ElementRef, QueryList } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadInformationModel } from '@core/services/head-refresher/head-refresher.models';
import { Select, Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as REQUESTS_MODELS from '@modules/requests/model/requests.models'
import { MatSelectChange } from '@angular/material/select';
import { DAYS_OF_WEEK } from '@modules/requests/model/requests.config';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { combineLatest, Observable, Subject, forkJoin } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as REQUESTS_CONFIGS from '@modules/requests/model/requests.config';
import * as REQUESTS_ACTIONS from '@modules/requests/state/requests.actions';
import { RequestsStateSelectors } from '@modules/requests/state/requests.selectors';

import * as ckEditorClassic from 'src/ckeditor5img/build/ckeditor';
import { requirementsEditor } from '@shared/components/rich-text-editor/requirements.config';
import { cleanTextFromHtml } from '@shared/helpers/clean-text-from-html.helper';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { SSAConfigInst } from 'src/app/config/app.config';
import { UserState } from '@core/modules/user/state/user.state';
import { loggedInUserModel } from '@core/modules/user/model/user.model';
import { AutocompleteComponent } from '../../../../../shared/modules/autocomplete/components/autocomplete/autocomplete.component';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
@Component({
  selector: 'ssa-create-recruitment-form',
  templateUrl: './create-recruitment-form.component.html',
  styleUrls: ['./create-recruitment-form.component.scss'],
})
export class CreateRecruitmentFormComponent implements OnInit, OnDestroy {

  @ViewChild('shiftAutoCompleteInput', { read: MatAutocompleteTrigger }) shiftAutoComplete: MatAutocompleteTrigger;
  @ViewChild('priorityAutoCompleteInput', { read: MatAutocompleteTrigger }) priorityAutoComplete: MatAutocompleteTrigger;
  @ViewChild('englishLevelAutoCompleteInput', { read: MatAutocompleteTrigger }) englishLevelAutoComplete: MatAutocompleteTrigger;
  @ViewChild('accountAutoCompleteInput', { read: MatAutocompleteTrigger }) accountsAutoComplete: MatAutocompleteTrigger;
  @ViewChild('productAutoCompleteInput', { read: MatAutocompleteTrigger }) productAutoComplete: MatAutocompleteTrigger;
  @ViewChild('teamAutoCompleteInput', { read: MatAutocompleteTrigger }) teamAutoComplete: MatAutocompleteTrigger;
  @ViewChild('accountRequesterNameAutoCompleteInput', { read: MatAutocompleteTrigger }) accountRequesterNameAutoComplete: MatAutocompleteTrigger;
  @ViewChild('customerSuccessRepresentativeAutoCompleteInput', { read: MatAutocompleteTrigger }) customerSuccessRepresentativeAutoComplete: MatAutocompleteTrigger;
  @ViewChild('roleDropDown') roleEl: AutocompleteComponent;
  // dynamic data lists
  @ViewSelectSnapshot(RequestsStateSelectors.AllJobsWithLevels) public allJobs: REQUESTS_MODELS.AllJobsWithLevels[];
  @ViewSelectSnapshot(RequestsStateSelectors.PositionLocations) public locationsList: string[];
  @ViewSelectSnapshot(RequestsStateSelectors.recruitmentDetails) public recruitmentDetails: REQUESTS_MODELS.RecruitmentDetailsModel;
  // Selectors
  @Select(RequestsStateSelectors.TeamPL) public teamPL$: Observable<REQUESTS_MODELS.TeamPL>;
  @Select(RequestsStateSelectors.MyTeamDetails) public myTeamDetails$: Observable<REQUESTS_MODELS.MyTeamDetails>;
  @Select(RequestsStateSelectors.myRecruitmentAccounts) private _myAccounts$: Observable<REQUESTS_MODELS.RecruitmentAccountModel[]>;
  @Select(RequestsStateSelectors.AllShifts) private _allShifts$: Observable<REQUESTS_MODELS.Shift[]>;
  @Select(RequestsStateSelectors.CustomerSuccess) private _allCustomerSuccess$: Observable<REQUESTS_MODELS.CustomerSuccess[]>;
  @Select(RequestsStateSelectors.MyProducts) private _allProducts$: Observable<REQUESTS_MODELS.ProductModel[]>;
  @Select(RequestsStateSelectors.MyTeams) private _allTeams$: Observable<REQUESTS_MODELS.ResourceBasedTeam[]>;
  @Select(RequestsStateSelectors.ClientRequester) private _allClientRequester$: Observable<REQUESTS_MODELS.ClientRequester[]>;
  @Select(UserState.user) private _user$: Observable<loggedInUserModel>;

  public editMode: boolean = false

  // Class Properties
  public teamPL: REQUESTS_MODELS.TeamPL;
  public selectedSkill: REQUESTS_MODELS.AllSkills[] = [];
  public selectedInterviewer: any[] = [];

  public department: REQUESTS_MODELS.DepartmentModel
  public departmentName: string = ''

  // Shifts Properties
  public shiftFormControl = new FormControl('', [Validators.required]);
  public filteredShifts: Observable<REQUESTS_MODELS.Shift[]>
  public _allShifts: REQUESTS_MODELS.Shift[];
  public selectedShift: REQUESTS_MODELS.Shift;

  // Priority Properties
  public priorityFormControl = new FormControl('', [Validators.required]);
  public filteredPriorities: Observable<{ id: string, name: string }[]>;
  priorities: { id: string, name: string }[] = [
    {
      id: '0',
      name: 'Low'
    },
    {
      id: '10',
      name: 'Medium'
    },
    {
      id: '20',
      name: 'High'
    },
    {
      id: '30',
      name: 'Urgent'
    }
  ];
  public recruitmentTypes = REQUESTS_CONFIGS.RecruitmentTypes


  // English Level Properties
  public englishFluencyFormControl = new FormControl('', [Validators.required]);
  public filteredEnglishLevels: Observable<string[]>;
  public englishFluencyList: string[] = REQUESTS_CONFIGS.ENGLISH_LEVELS_TYPES

  public CKEditorValueObservable = new Subject<string>();

  // Customer Success Properties
  public customerSuccessFormControl = new FormControl({ value: '', disabled: true })
  public allCustomerList: REQUESTS_MODELS.CustomerSuccess[];
  public filteredCustomerList: Observable<REQUESTS_MODELS.CustomerSuccess[]>

  // Account properties
  public accountFormControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public allAccountsList: REQUESTS_MODELS.RecruitmentAccountModel[];
  public filteredAccounts: Observable<REQUESTS_MODELS.RecruitmentAccountModel[]>

  // product props
  public productFormControl = new FormControl({ value: null, disabled: true }, [Validators.required])
  public productList: REQUESTS_MODELS.ProductModel[];
  public filteredProduct: Observable<REQUESTS_MODELS.ProductModel[]>

  // Resource Based Team Props
  public teamFormControl = new FormControl({ value: null, disabled: true }, [Validators.required]);
  public TeamsList: REQUESTS_MODELS.ResourceBasedTeam[];
  public filteredTeams: Observable<REQUESTS_MODELS.ResourceBasedTeam[]>

  // Client Requester props
  public clientReFormControl = new FormControl({ value: null, disabled: true }, [Validators.required]);
  public _allClientRequesters: REQUESTS_MODELS.ClientRequester[];
  public selectedClientRequester: REQUESTS_MODELS.ClientRequester;
  public filteredClientRequester: Observable<REQUESTS_MODELS.ClientRequester[]>;
  // role Props
  public roleFormControl = new FormControl({ value: null, disabled: true }, [Validators.required]);

  public ckEditorConfig = {
    config: requirementsEditor,
    instance: ckEditorClassic,
    maxLength: 8000
  };


  /* Enums */
  public DAYS_OF_WEEK = DAYS_OF_WEEK;
  public prioritiesEnum = REQUESTS_CONFIGS.PRIORITIES_ENUM;


  public selectedResource: REQUESTS_MODELS.ResourceBasedInfo;


  // date picker config
  public datePickerConfig = {
    min: this.getDate()
  }
  // reactive form properties
  public recruitmentForm: FormGroup;
  public formControls: { [control: string]: AbstractControl | FormControl };

  public jobLevels: REQUESTS_MODELS.Level[] = [];

  public headInformation: HeadInformationModel = {
    title: `CREATE RECRUITMENT REQUEST`
  };
  public employmentTypes = REQUESTS_CONFIGS.EMPLOYMENT_TYPES
  myTeamDetails: REQUESTS_MODELS.MyTeamDetails;
  constructor(
    private _formBuilder: FormBuilder,
    private _snackbarService: SnackBarsService,
    private _store: Store,
    private _router: Router,
    private _route: ActivatedRoute,

  ) { }

  /* __________________ Reducers __________________ */
  @Dispatch() public _fireGetAllSkills() {
    return new REQUESTS_ACTIONS.GetAllSkills();
  }
  @Dispatch() private _fireGetAllJobsWithLevels() {
    return new REQUESTS_ACTIONS.GetAllJobsWithLevels();
  }
  @Dispatch() private _fireGetTeamPL() {
    return new REQUESTS_ACTIONS.GetTeamPL();
  }

  @Dispatch() private _fireGetMyTeamDetails() {
    return new REQUESTS_ACTIONS.GetMyTeamDetails();
  }
  @Dispatch() private _fireGetDepartmentsWebAPI() {
    return new REQUESTS_ACTIONS.GetDepartmentsWebAPI();
  }
  @Dispatch() private _fireGetAllShifts() {
    return new REQUESTS_ACTIONS.GetAllShifts();
  }

  @Dispatch() private _fireGetPositionLocations() {
    return new REQUESTS_ACTIONS.GetPositionLocations()
  }

  @Dispatch() private _fireGetMyAccounts() {
    return new REQUESTS_ACTIONS.GetMyAccounts()
  }
  @Dispatch() private _fireGetCustomerSuccess() {
    return new REQUESTS_ACTIONS.GetCustomerSuccess()
  }

  @Dispatch() private _fireGetMyProducts(accountId: string) {
    return new REQUESTS_ACTIONS.GetMyProducts(accountId)
  }
  @Dispatch() private _fireGetMyTeams(productId: string) {
    return new REQUESTS_ACTIONS.GetMyTeams(productId)
  }
  @Dispatch() private _fireGetClientRequester(accountId: string) {
    return new REQUESTS_ACTIONS.GetClientRequester(accountId)
  }
  @Dispatch() private _fireGetMoreDetailsRecruitment(requestId: string) { return new REQUESTS_ACTIONS.GetMoreDetailsRecruitment(requestId) }

  ngOnInit(): void {
    this._initForm();
    // calling methods
    this._toggleRequirementsCtrlStatus();
    window.addEventListener('scroll', this._scrollEvent, true);
    this._fireSubscriptions();
    if (this._route.snapshot.params.id) {
      this.headInformation.title = `EDIT RECRUITMENT REQUEST `;
      this.editMode = true;
      forkJoin([
        this._store.dispatch([
          new REQUESTS_ACTIONS.GetTeamPL(),
          new REQUESTS_ACTIONS.GetMyTeamDetails(),
          new REQUESTS_ACTIONS.GetAllJobsWithLevels(),
          new REQUESTS_ACTIONS.GetAllShifts(),
          new REQUESTS_ACTIONS.GetPositionLocations(),
          new REQUESTS_ACTIONS.GetDepartmentsWebAPI(),
          new REQUESTS_ACTIONS.GetMyAccounts(),
        ]),
      ]).subscribe(() => {

        this._store.dispatch(new REQUESTS_ACTIONS.GetMoreDetailsRecruitment(this._route.snapshot.params.id)).subscribe(res => {
          this._patchRecruitmentValues();
        })
      })
    } else {
      /* Firing Actions*/
      this._fireGetTeamPL();
      this._fireGetMyTeamDetails();
      this._fireGetAllJobsWithLevels();
      this._fireGetDepartmentsWebAPI();
      this._fireGetAllShifts();
      this._fireGetPositionLocations();
      this._fireGetMyAccounts();
    }


  }

  ngOnDestroy(): void {
    this.CKEditorValueObservable.unsubscribe();
  }

  // auto Complete Validation
  public validateAutoCompleteFormControl(event, formControl: string) {
    if (!(this.formControls[formControl].value && event.value)) {
      this.formControls[formControl].markAsTouched();
    }
    if (event.value) {
      switch (formControl) {
        case 'shiftId':
          if (!this.formControls[formControl].value) this.shiftFormControl.setErrors({ notSelected: true })
          break;
        case 'priority':
          if (!this.formControls[formControl].value) this.priorityFormControl.setErrors({ notSelected: true })
          break;
        case 'englishFluency':
          if (!this.formControls[formControl].value) this.englishFluencyFormControl.setErrors({ notSelected: true })
          break;
        case 'technicalInterviewer':
          if (!this.formControls[formControl].value) this.englishFluencyFormControl.setErrors({ notSelected: true })
          break;
        case 'account':
          if (!this.formControls[formControl].value) this.accountFormControl.setErrors({ notSelected: true })
          break;
        case 'product':
          if (!this.formControls[formControl].value) this.productFormControl.setErrors({ notSelected: true })
          break;
        case 'resourceTeam':
          if (!this.formControls[formControl].value) this.teamFormControl.setErrors({ notSelected: true })
          break;
        case 'clientRequesterName':
          if (!this.formControls[formControl].value) this.clientReFormControl.setErrors({ notSelected: true })
          break;
        case 'roleId':
          if (!this.formControls[formControl].value) this.roleFormControl.setErrors({ notSelected: true })
          break;
        default:
          break;
      }
    }

  }

  //technical interviewer methods
  public addTechnicalInterviewer(technicalInterviewer: REQUESTS_MODELS.TechnicalInterviewer[]) {
    let technicalArr = technicalInterviewer.map(interviewer => interviewer.organizationEmail);
    this.selectedInterviewer = [...technicalInterviewer]
    this.formControls.technicalInterviewer.patchValue(technicalArr);
  }

  public removeTechnicalInterviewer(interviewerId) {
    this.selectedInterviewer = this.selectedInterviewer.filter(interviewer => interviewer.id !== interviewerId)
    this.formControls.technicalInterviewer.patchValue(this.selectedInterviewer.map(interviewer => interviewer.organizationEmail));

  }


  //  skills methods
  public addSkills(skills: REQUESTS_MODELS.AllSkills[]) {
    let skillsArr = skills.map(skill => skill.id);
    this.selectedSkill = [...skills];
    this.formControls.skills.patchValue(skillsArr);
  }

  public removeSkill(skillId) {
    this.selectedSkill = this.selectedSkill.filter(item => item.id !== skillId)
    this.formControls.skills.patchValue(this.selectedSkill.map(skill => skill.id));
  }

  // adding Role
  public addRole(role: REQUESTS_MODELS.ProfileRoles) {
    this.formControls.roleId.patchValue(role?.id)
  }

  // form controls Validations
  public checkValidity(val, controlName: string) {
    if (val?.value?.trim() === '' && !this.editMode) {
      this.formControls[controlName].setValue(null)
      this.formControls[controlName].markAsTouched()
    }
  }

  public validateOnlySpaces(control: AbstractControl) {
    if (control.value.trim().length === 0) control.setErrors({ pattern: true })
  }

  // filtering
  public _filterEn(value: string): string[] {
    const filterValue = value.toLowerCase().trim();
    return this.englishFluencyList.filter(option => option.toLowerCase().includes(filterValue))
  }
  public _filter(value: string): { id: string, name: string }[] {
    const filterValue = value.toLowerCase();
    return this.priorities.filter(option => option.name.toLowerCase().includes(filterValue))
  }

  // Date picker
  public getDate() {
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date
  }
  //
  public onJobFunctionChanged(ev: MatSelectChange) {
    this.formControls.jobLevelId.enable();
    this.jobLevels = this.allJobs.find(item => item.id === ev.value).levels
  }


  public formatDate(ev: Date): string {
    const date = new Date(ev)
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDate = year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T00:00:00.000Z";
    return formattedDate
  }

  // priority selection
  public prioritySelected(ev: MatAutocompleteSelectedEvent) {
    this.priorityFormControl.patchValue(this.prioritiesEnum[ev.option.value])
    this.formControls.priority.patchValue(ev.option.value)
  }

  // english levels selection
  public englishLevelSelected(ev: MatAutocompleteSelectedEvent) {
    this.englishFluencyFormControl.patchValue(ev.option.value)
    this.formControls.englishFluency.patchValue(ev.option.value)
  }

  // shift Selection
  public onShiftSelect(ev: MatAutocompleteSelectedEvent) {
    const shift: REQUESTS_MODELS.Shift = this._allShifts.find(shift => shift.id === ev.option.value)
    this.shiftFormControl.patchValue(shift.name);
    this.formControls.shiftId.patchValue(shift.id);
    this.selectedShift = {
      ...shift,
      fromTo: this.setTime(shift),
      workingHours: shift.workingHoursInMinutes / 60,
      days: shift.weekDays.map(day => this.DAYS_OF_WEEK[day]).join(', ')
    }
  }
  /* account Info Section selection methods */
  // Customer Success
  public onCustomerSuccessSelect(ev: MatAutocompleteSelectedEvent) {
    const data = this.allCustomerList.find(item => item.organizationEmail === ev.option.value);
    this.customerSuccessFormControl.patchValue(data.fullName);
    this.formControls.customerSuccessRepOrganizationEmail.patchValue(data.organizationEmail)
    this.formControls.customerSuccessRepName.patchValue(data.fullName)
  }

  public onAccountSelect(ev: MatAutocompleteSelectedEvent) {
    const data = this.allAccountsList.find(item => item.id === ev.option.value)
    this.accountFormControl.patchValue(data.name);
    this.formControls.account.patchValue(data.id);
    this._fireGetMyProducts(data.id)
    this.formControls.product.enable();
    this.clientReFormControl.enable();
    this.formControls.clientRequesterName.enable();
    this.formControls.clientRequesterTitle.setValue(null);
    this.formControls.clientRequesterEmail.setValue(null);
    this.formControls.clientRequesterTitle.disable();
    this.formControls.clientRequesterEmail.disable();
    this._fireGetClientRequester(data.id);

  }



  // product selection
  public onProductSelect(ev: MatAutocompleteSelectedEvent) {
    const product = this.productList.find(product => product.id === ev.option.value)
    this.productFormControl.patchValue(product.name);
    this.formControls.product.patchValue(product.id);
    this._fireGetMyTeams(product.id)
    this.formControls.resourceTeam.enable();
  }

  // resource Based Team
  public onTeamSelect(ev: MatAutocompleteSelectedEvent) {
    const team = this.TeamsList.find(team => team.id === ev.option.value)
    this.teamFormControl.patchValue(team.name);
    this.formControls.resourceTeam.patchValue(team.name);
    this.formControls.resourceTeamId.patchValue(team.id)
  }

  // Client Requester Selection

  public onClientRequesterSelect(ev: MatAutocompleteSelectedEvent) {
    const val = ev.option.value
    const client = this._allClientRequesters?.find(client => client.fullname === val)
    if (client) {
      this.clientReFormControl.patchValue(client.fullname)
      this.formControls.clientRequesterName.patchValue(client?.fullname);
      this.formControls.clientRequesterTitle.patchValue(client?.title);
      this.formControls.clientRequesterEmail.patchValue(client?.clientEmail);
      this.selectedClientRequester = {
        ...client,
      }
    } else {
      this.formControls.clientRequesterName.patchValue(val);

      this.formControls.clientRequesterEmail.enable();
      this.formControls.clientRequesterEmail.reset();
      this.formControls.clientRequesterTitle.enable();
      this.formControls.clientRequesterTitle.reset();
    }

  }

  /* Form Submit */
  public onSubmit() {
    const body: REQUESTS_MODELS.RecruitmentRequestFormBodyModel = this._preparePositionFormBody();
    if (this.editMode) {
      body.id = this.recruitmentDetails.id;
      this._store.dispatch(new REQUESTS_ACTIONS.UpdateRecruitmentRequest(body)).subscribe(
        (res) => {
        },
        // failure case
        (err) => {
          this._errorMessage(err)
        },
        // on Complete Successfully
        () => {
          this._successMessage('updated')
        },
      )
    } else {
      this._store.dispatch(new REQUESTS_ACTIONS.CreateRecruitmentRequest(body)).subscribe(
        (res) => {
        },
        // failure case
        (err) => {
          this._errorMessage(err)

        },
        // on Complete Successfully
        () => {
          this._successMessage('created')
        },
      )
    }
  }


  public cancel() {
    this._router.navigateByUrl('/my-requests')
  }


  public get getRequirementsActualValue(): string {
    return cleanTextFromHtml(this.formControls.requirements.value);
  }

  public setTime(shift: REQUESTS_MODELS.Shift) {
    let from = `${shift.fromHour >= 10 ? shift.fromHour : '0' + shift.fromHour}:${shift.fromMinutes >= 10 ? shift.fromMinutes : '0' + shift.fromMinutes}`;
    let to = `${shift.toHour >= 10 ? shift.toHour : '0' + shift.toHour}:${shift.toMinutes >= 10 ? shift.toMinutes : '0' + shift.toMinutes}`;
    return `${from} - ${to}`
  }

  public clearAutoCompleteValue(ev, formControl: string) {
    ev.stopPropagation();
    this.formControls[formControl].patchValue(null);
    switch (formControl) {
      case 'shiftId':
        this.shiftFormControl.setValue('');
        this.selectedShift = null;
        break;
      case 'priority':
        this.priorityFormControl.setValue('');
        break;
      case 'englishFluency':
        this.englishFluencyFormControl.setValue('')
        break;
      case 'customerSuccessRepOrganizationEmail':
        this.customerSuccessFormControl.setValue('');
        this.formControls.customerSuccessRepName.setValue('')
        break;
      case 'account':
        this.accountFormControl.setValue('');
        // reset & disable product
        this.formControls.product.setValue(null);
        this.productFormControl.reset();
        this.productFormControl.disable();
        // reset & disable resourceTeam
        this.formControls.resourceTeam.setValue(null);
        this.teamFormControl.reset();
        this.teamFormControl.disable();
        // reset & disable client Requester Name
        this.formControls.clientRequesterName.setValue(null);
        this.clientReFormControl.setValue(null);
        this.clientReFormControl.reset();
        this.selectedClientRequester = null;
        this.filteredClientRequester = null;
        this.clientReFormControl.disable();
        break;
      case 'product':
        this.productFormControl.setValue('');
        this.formControls.resourceTeam.setValue(null);
        this.teamFormControl.reset();
        this.teamFormControl.disable();
        break;
      case 'resourceTeam':
        this.teamFormControl.setValue('');
        break;
      case 'clientRequesterName':
        this.clientReFormControl.setValue(null);
        this.formControls.clientRequesterEmail.patchValue(null)
        this.formControls.clientRequesterTitle.patchValue(null)
        this.formControls.clientRequesterEmail.disable();
        this.formControls.clientRequesterTitle.disable();

        break;
      default:
        break;
    }
  }


  public onResourceBasedChange() {
    if (this.formControls.isEmployeeResourceBased.value) {
      this._enableSourceBasedControls();
    } else {
      this._disableSourceBasedControls();
    }
  }

  private _scrollEvent = (): void => {
    if (this.shiftAutoComplete?.panelOpen) {
      this.shiftAutoComplete.updatePosition();
    } else if (this.priorityAutoComplete?.panelOpen) {
      this.priorityAutoComplete.updatePosition();
    }
    else if (this.englishLevelAutoComplete?.panelOpen) {
      this.englishLevelAutoComplete.updatePosition();
    }
    else if (this.accountsAutoComplete?.panelOpen) {
      this.accountsAutoComplete.updatePosition();
    }
    else if (this.productAutoComplete?.panelOpen) {
      this.productAutoComplete.updatePosition();
    }
    else if (this.teamAutoComplete?.panelOpen) {
      this.teamAutoComplete.updatePosition();
    }
    else if (this.accountRequesterNameAutoComplete?.panelOpen) {
      this.accountRequesterNameAutoComplete.updatePosition();
    }
    else if (this.customerSuccessRepresentativeAutoComplete?.panelOpen) {
      this.customerSuccessRepresentativeAutoComplete.updatePosition();
    }
  };

  private _initForm() {
    this.recruitmentForm = this._formBuilder.group({
      id: [{ value: '', disabled: true }],
      fullPLName: [{ value: '', disabled: true }],
      source: [{ value: 'SSA', disabled: true }],
      teamName: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      employmentType: [0],
      recruitmentType: [0],
      expectedHiringDate: [this.datePickerConfig.min],
      positionTitle: ['', [Validators.maxLength(75), Validators.required, Validators.pattern(/^$|.*\S+.*/)]],
      jobId: ['', [Validators.required]],
      jobLevelId: [{ value: '', disabled: true }, [Validators.required]],
      location: ['', [Validators.required]],
      shiftId: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      NumOfVacancies: ['', [Validators.required, Validators.max(20), Validators.min(1)]],
      englishFluency: [null, [Validators.required]],
      experience: ['', [Validators.maxLength(75), Validators.required]],
      notes: ['', [Validators.maxLength(500), Validators.pattern(/^$|.*\S+.*/)]],
      skills: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      isEmployeeResourceBased: [{ value: false, disabled: true }],
      customerSuccessRepOrganizationEmail: [{ value: null, disabled: true }],
      customerSuccessRepName: [{ value: null, disabled: true }],
      technicalInterviewer: [[], [Validators.required]],
      account: [{ value: null, disabled: true }, [Validators.required]],
      resourceTeam: [{ value: null, disabled: true }, [Validators.required]],
      resourceTeamId: [{ value: null, disabled: true }, [Validators.required]],
      product: [{ value: null, disabled: true }, [Validators.required]],
      clientRequesterName: [{ value: null, disabled: true }, [Validators.required]],
      clientRequesterTitle: [{ value: '', disabled: true }, [Validators.required]],
      clientRequesterEmail: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      roleId: [{ value: null, disabled: true }, [Validators.required]]
    })
    this.formControls = provideReactiveFormGetters(this.recruitmentForm, '');
  }


  private _fireSubscriptions() {
    /* for P&L*/
    this.teamPL$.subscribe(data => {
      if (data) {
        this.teamPL = data
        if (!this.editMode)
          this.formControls.fullPLName.patchValue(data.fullName)

      }
    });
    /* for Team Name */
    this.myTeamDetails$.subscribe(myTeamDetails => {
      if (myTeamDetails) {
        this.myTeamDetails = myTeamDetails;
        if (!this.editMode)
          this.formControls.teamName.patchValue(myTeamDetails.name)
      }
    })

    /* for shifts */
    this._allShifts$.subscribe(shifts => {
      if (shifts.length) {
        this._allShifts = shifts
        this.filteredShifts = this.shiftFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterShift(value || ''))
        )
      }
    })
    /* for Resource Based (Account info)  */
    this._myAccounts$.subscribe(res => {
      if (res?.length) {
        this._fireGetCustomerSuccess();
        this.checkingResourceBased()
        this.formControls.isEmployeeResourceBased.enable();
        this.allAccountsList = res;
        this.filteredAccounts = this.accountFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterAccounts(value || ''))
        )
      }
    })

    //  client requester
    this._allClientRequester$.subscribe(clients => {
      if (clients.length) {
        this._allClientRequesters = clients
        this.filteredClientRequester = this.clientReFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterClientRequester(value || ''))
        )
      }
    })

    //  Filteration
    /* priorities */
    this.filteredPriorities = this.priorityFormControl.valueChanges.pipe(
      debounceTime(400),
      startWith(''),
      map(value => this._filter(value || '')),
    );
    /* english Levels */
    this.filteredEnglishLevels = this.englishFluencyFormControl.valueChanges.pipe(
      debounceTime(400),
      startWith(''),
      map(value => this._filterEn(value || '')),
    );

    this._user$.subscribe((res: loggedInUserModel) => {
      if (res) {
        if (!this.editMode) {
          this.departmentName = res?.department?.name ? res?.department?.name : ''
          this.recruitmentForm.controls.department.patchValue(res?.department?.id)
        }
      }
    })
  }

  private _patchRecruitmentValues() {
    let shift = {
      fromHour: +this.recruitmentDetails.shiftFromHour,
      fromMinutes: +this.recruitmentDetails.shiftFromMinutes,
      toHour: +this.recruitmentDetails.shiftToHour,
      toMinutes: +this.recruitmentDetails.shiftToMinutes
    }
    this.departmentName = this.recruitmentDetails?.positionDepartmentName;
    this.formControls.jobLevelId.enable();
    this.jobLevels = this.allJobs.find(item => item.id === this.recruitmentDetails.positionJobId).levels;
    this.shiftFormControl.patchValue(this.recruitmentDetails.shiftName);
    this.selectedShift = {
      fromTo: this.setTime(shift),
      workingHours: this.recruitmentDetails.shiftWorkingHours,
      days: this.recruitmentDetails?.shiftWorkingDays.map(day => this.DAYS_OF_WEEK[day]).join(', ')
    }
    this.priorityFormControl.patchValue(this.priorities.find(item => +item.id === this.recruitmentDetails.positionPriority).name)

    this.englishFluencyFormControl.patchValue(this.recruitmentDetails.englishFluency)
    this.selectedSkill = this.recruitmentDetails.selectedSkills;
    this.selectedInterviewer = this.recruitmentDetails.technicalInterviewersProfiles;
    const found = this.allAccountsList?.find(item => item.id === this.recruitmentDetails.accountId);

    this.shiftFormControl.markAsTouched();
    this.priorityFormControl.markAsTouched();
    this.englishFluencyFormControl.markAsTouched();

    
    if(!found && this.recruitmentDetails.isEmployeeResourceBased){
      this._snackbarService.openFailureSnackbar({
        message: 'Please select another account for this request to be able to update request successfully.',
        duration: 5,
        showCloseBtn: false
      });
    }
    if (this.recruitmentDetails.isEmployeeResourceBased) {
      if (found) {
        this.accountFormControl.patchValue(this.recruitmentDetails.accountName)
        this._fireGetMyProducts(this.recruitmentDetails.accountId);
        this._fireGetClientRequester(this.recruitmentDetails.accountId)
        this._fireGetMyTeams(this.recruitmentDetails.productId);
        this.productFormControl.patchValue(this.recruitmentDetails.productName);
        this.teamFormControl.patchValue(this.recruitmentDetails.erbTeamName);
        this.clientReFormControl.patchValue(this.recruitmentDetails.clientRequesterName);
        this.clientReFormControl.enable();
        this.productFormControl.markAsTouched();
        this.teamFormControl.markAsTouched();
        this.clientReFormControl.markAsTouched();
        this.accountFormControl.markAsTouched();
      } 
      setTimeout(() => {
        //! this line is made as viewChild returns false because it didn't catch the updates in time 
        this.roleEl.searchListRef.nativeElement.placeholder = this.recruitmentDetails.roleName
      }, 300);
      this.customerSuccessFormControl.patchValue(this.recruitmentDetails.customerSuccessRepName)
      this.accountFormControl.enable();
      this.customerSuccessFormControl.enable();
      
      this.customerSuccessFormControl.markAsTouched();
    }

    this.recruitmentForm.patchValue({
      id: this.recruitmentDetails.id,
      department: this.recruitmentDetails.positionDepartmentId,
      fullPLName: this.recruitmentDetails.teamPLName,
      teamName: this.recruitmentDetails.teamName,
      positionTitle: this.recruitmentDetails.positionTitle,
      expectedHiringDate: this.recruitmentDetails?.positionHiringDate ? this.recruitmentDetails?.positionHiringDate : this.datePickerConfig.min,
      jobId: this.recruitmentDetails.positionJobId,
      jobLevelId: this.recruitmentDetails.positionLevelId,
      employmentType: this.recruitmentDetails.positionEmploymentType,
      location: this.recruitmentDetails.positionLocation,
      shiftId: this.recruitmentDetails.shiftId,
      priority: this.recruitmentDetails.positionPriority,
      NumOfVacancies: this.recruitmentDetails.positionNumOfVacancies,
      englishFluency: this.recruitmentDetails.englishFluency,
      experience: this.recruitmentDetails.positionExperienceNeeded,
      skills: this.recruitmentDetails.selectedSkills.map(skill => skill.id),
      technicalInterviewer: this.recruitmentDetails.technicalInterviewersProfiles.map(item => item.organizationEmail),
      recruitmentType: REQUESTS_CONFIGS.RecruitmentTypes.find(item => item.name === this.recruitmentDetails.recruitmentType).id,
      notes: this.recruitmentDetails?.instanceNote,
      requirements: this.recruitmentDetails.positionRolesAndResponsibilities.normal,
      isEmployeeResourceBased: this.recruitmentDetails.isEmployeeResourceBased,
      //conditioning on found value will patch the below properties
      ...(found && {
        account: this.recruitmentDetails.accountId,
        product: this.recruitmentDetails.productId,
        resourceTeam: this.recruitmentDetails.erbTeamName,
        resourceTeamId: this.recruitmentDetails.erbTeamId,
        clientRequesterName: this.recruitmentDetails.clientRequesterName,
        clientRequesterEmail: this.recruitmentDetails.clientRequesterEmail,
        clientRequesterTitle: this.recruitmentDetails.clientRequesterTitle,
      }),
      customerSuccessRepOrganizationEmail: this.recruitmentDetails.customerSuccessRepOrganizationEmail,
      roleId: this.recruitmentDetails.roleId
    })


    for (const formControl in this.recruitmentForm.controls) {
      if (formControl === 'expectedHiringDate')
        this.formControls[formControl].disable();
      else if (this.recruitmentDetails.isEmployeeResourceBased && (formControl === 'jobLevelId' || formControl === 'account' || formControl === 'resourceTeam' || formControl === 'product' || formControl === 'clientRequesterName' || formControl === 'roleId'))
        this.formControls[formControl].enable();
      // marking formControl is touched to enable validations;
      if(this.formControls[formControl].value){
        this.formControls[formControl].markAsTouched()
      }
    }

  }

  private checkingResourceBased() {
    this._allProducts$.subscribe(data => {
      if (data?.length) {
        this.productFormControl.enable();
        this.productList = data
        this.filteredProduct = this.productFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterProduct(value || ''))
        )
      }
    })

    this._allTeams$.subscribe(data => {
      if (data?.length) {
        this.teamFormControl.enable();
        this.TeamsList = data
        this.filteredTeams = this.teamFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterResourceTeam(value || ''))
        )
      }
    })

    this._allCustomerSuccess$.subscribe(res => {
      if (res.length) {
        this.allCustomerList = res;
        this.filteredCustomerList = this.customerSuccessFormControl.valueChanges.pipe(
          debounceTime(400),
          startWith(''),
          map(value => this._filterCustomerSuccess(value || ''))
        )
      }
    })
  }

  private _toggleRequirementsCtrlStatus() {
    this.CKEditorValueObservable.pipe(
      debounceTime(1000)
    ).subscribe();
  }

  private _enableSourceBasedControls() {
    this.customerSuccessFormControl.enable();
    this.formControls.customerSuccessRepOrganizationEmail.enable();

    this.accountFormControl.enable();
    this.formControls.account.enable();

    this.formControls.roleId.enable();

  }

  private _disableSourceBasedControls() {

    // reset on toggle change again

    // reset & disable CustomerSuccess
    this.customerSuccessFormControl.reset();
    this.formControls.customerSuccessRepOrganizationEmail.reset();
    this.formControls.customerSuccessRepName.reset();

    // Account
    this.accountFormControl.setValue(null);
    this.accountFormControl.reset(null);
    this.formControls.account.disable();
    this.formControls.account.setValue(null);

    // reset & disable product
    this.productFormControl.disable();
    this.productFormControl.setValue(null);
    this.formControls.product.setValue(null);
    this.formControls.product.reset();
    this.formControls.product.disable();

    // reset & disable resourceTeam
    this.teamFormControl.disable();
    this.teamFormControl.reset();
    this.formControls.resourceTeam.disable();
    this.formControls.resourceTeam.setValue(null)
    this.formControls.resourceTeamId.setValue(null)

    // reset & disable client Requester
    // name
    this.clientReFormControl.setValue(null);
    this.clientReFormControl.reset();
    this.clientReFormControl.disable();
    this.formControls.clientRequesterName.setValue(null);
    this.formControls.clientRequesterName.disable();
    // Title & email
    this.formControls.clientRequesterTitle.setValue(null);
    this.formControls.clientRequesterTitle.disable();
    this.formControls.clientRequesterEmail.setValue(null);
    this.formControls.clientRequesterEmail.disable();

    // reset & disable role id
    this.formControls.roleId.setValue(null);
    this.formControls.roleId.reset();
    this.formControls.roleId.disable();
  }

  private _filterShift(value: string): REQUESTS_MODELS.Shift[] {
    const filterValue = value.toLowerCase().trim();
    if (filterValue === '') {
      return this._allShifts;
    } else {
      return this._allShifts.filter(shift => shift?.name?.toLowerCase()?.includes(filterValue))
    }
  }

  private _filterCustomerSuccess(value: string): REQUESTS_MODELS.CustomerSuccess[] {
    const filterValue = value.toLowerCase().trim();
    if (filterValue === '') {
      return this.allCustomerList;
    } else {
      return this.allCustomerList.filter(item => item?.fullName?.toLowerCase()?.includes(filterValue))
    }
  }

  private _filterAccounts(value: string): REQUESTS_MODELS.RecruitmentAccountModel[] {
    const filterValue = value.toLowerCase().trim();
    if (filterValue === '') {
      return this.allAccountsList;
    } else {
      return this.allAccountsList.filter(item => item?.name?.toLowerCase()?.includes(filterValue))
    }
  }

  private _filterProduct(data: string): REQUESTS_MODELS.ProductModel[] {
    const filteredValue = data.toLowerCase().trim();
    if (filteredValue === '') {
      return this.productList;
    } else {
      return this.productList.filter(item => item?.name?.toLowerCase()?.includes(filteredValue))
    }
  }

  private _filterResourceTeam(data: string): REQUESTS_MODELS.ResourceBasedTeam[] {
    const filteredValue = data.toLowerCase().trim();
    if (filteredValue === '') {
      return this.TeamsList;
    } else {
      return this.TeamsList.filter(item => item?.name?.toLowerCase()?.includes(filteredValue))
    }
  }

  private _filterClientRequester(value: string) {

    const filterValue = value.toLowerCase().trim();
    if (filterValue === '') {
      return this._allClientRequesters;
    } else {
      return this._allClientRequesters.filter(clientRequester => clientRequester?.fullname?.toLowerCase()?.includes(filterValue))
    }
  }

  private _preparePositionFormBody(): REQUESTS_MODELS.RecruitmentRequestFormBodyModel {
    return {
      positionRequest: {
        title: this.formControls.positionTitle?.value?.trim(),
        rolesAndResponsibilities: {
          normal: this.formControls?.requirements?.value,
          decoded: cleanTextFromHtml(this.formControls.requirements?.value)
        },
        experienceNeeded: this.formControls.experience.value,
        skillIds: this.formControls.skills.value,
        location: this.formControls.location.value,
        numOfVacancies: this.formControls.NumOfVacancies.value,
        departmentId: this.formControls.department.value,
        employmentType: this.formControls.employmentType.value,
        expectedHiringDate: this.formatDate(this.formControls.expectedHiringDate.value),
        priority: +this.formControls.priority.value,
        jobId: this.formControls.jobId.value,
        levelId: this.formControls.jobLevelId.value,
      },
      resourceBasedInfo: {
        isEmployeeResourceBased: this.formControls.isEmployeeResourceBased.value,
        customerSuccessRepName: this.formControls.customerSuccessRepName.value,
        customerSuccessRepOrganizationEmail: this.formControls.customerSuccessRepOrganizationEmail.value,
        accountId: this.formControls.account.value,
        productId: this.formControls.product.value,
        erbTeamName: this.formControls.resourceTeam.value,
        erbTeamId: this.formControls.resourceTeamId.value,
        clientRequesterName: this.formControls.clientRequesterName.value,
        clientRequesterEmail: this.formControls.clientRequesterEmail.value,
        clientRequesterTitle: this.formControls.clientRequesterTitle.value,
        roleId: this.formControls.roleId.value,
      },
      shiftId: this.formControls.shiftId.value,
      instanceNote: this.formControls.notes?.value?.trim(),
      requestSource: this.formControls.source.value,
      teamPLOrganizationEmail: this.teamPL.organizationEmail,
      TechnicalInterviewersOrganizationEmails: this.formControls.technicalInterviewer.value,
      englishFluency: this.formControls.englishFluency.value,
      teamId: this.myTeamDetails.id,
      recruitmentType: this.formControls.recruitmentType.value
    }
  }


  private _successMessage(key: string) {
    this._snackbarService.openSuccessSnackbar({
      message: SSAConfigInst.CRUD_CONFIG.successMessages[key](
        'Your Recruitment request'
      ),
      duration: 5,
      showCloseBtn: false,
    })
    this._router.navigateByUrl('/my-requests')
  }

  private _errorMessage(err) {
    if (err.error.errorMessage && err.error.errorCode === 1) {
      let message = err.error.errors.filter((error, index) => {
        return err.error.errors.indexOf(error) === index
      })
      message = message.join(" . ");
      this._snackbarService.openFailureSnackbar({
        message,
        duration: 5,
        showCloseBtn: false
      });
    }
  }

}
