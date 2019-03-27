<template>
    <div>
        <v-container id="cgpa-table-container">
            <GradePointList :dataArray="cgpaList" :headers="headers" @deleteGradePoint="deleteItem" @editGradePoint="editItem"
                            id="cgpa-table"></GradePointList>
        </v-container>
        <div class="bottom-fixed">
            <v-container>
                <v-card class="my-3 ">
                    <div class="text-xs-center">
                        <v-layout align-center justify-space-between pt-2 row wrap>
                            <v-flex class="caption">Total Credit(s) : {{ total.credits }}</v-flex>
                            <v-flex class="caption">Total Weighted GP : {{total.weightedGP}}</v-flex>
                        </v-layout>
                        <p class="display-2 pa-2 mb-0">CGPA: {{total.cgpa}}</p>
                    </div>
                </v-card>
                <v-card>
                    <v-container>
                        <v-form>
                            <v-layout row wrap>
                                <v-flex pr-2 xs6>
                                    <v-text-field :autofocus=true label="Credit(s)" type="number"
                                                  v-model="credits"></v-text-field>
                                </v-flex>
                                <v-flex pl-2 xs6>
                                    <v-text-field label="Grade Point(GP)" type="number"
                                                  v-model="gradePoint"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout class="justify-center text-xs-center">
                                <div>
                                    <v-btn @click.prevent="saveList" class="normal-btn" color="teal accent-3"
                                           icon outline>
                                        <v-icon>save</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label teal--text text--accent-3">Save</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="stored" class="normal-btn" color="cyan accent-3" icon
                                           outline>
                                        <v-icon>storage</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label cyan--text text--accent-3">Stored</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="resetData" class="normal-btn" color="blue-grey lighten-1"
                                           icon outline>
                                        <v-icon>cached</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label blue-grey--text text--lighten-1">Reset</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="clear" class="normal-btn" color="error" icon outline>
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label error--text">Clear</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="add" class="normal-btn" color="indigo" icon outline
                                           type="submit">
                                        <v-icon>add</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label indigo--text">Add</div>
                                </div>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-container>
        </div>
        <v-dialog max-width="500px" v-model="dialog">
            <v-card>
                <p class="body-2 ma-0 px-3 pt-3 text-xs-center" v-if="dialogIsOpenedFor=='edit'">Edit</p>
                <p class="body-2 ma-0 px-3 pt-3 text-xs-center" v-else-if="dialogIsOpenedFor=='delete'">Are you
                    sure?</p>
                <p class="body-2 ma-0 px-3 pt-3 text-xs-center" v-else-if="dialogIsOpenedFor=='save-list'">Save CGPA List</p>

                <v-card-text>
                    <v-form v-if="dialogIsOpenedFor=='edit'">
                        <v-layout row wrap>
                            <v-flex pr-2 xs6>
                                <v-text-field :autofocus=true label="Credit(s)" type="number"
                                              v-model="editInputs.credits"></v-text-field>
                            </v-flex>
                            <v-flex pl-2 xs6>
                                <v-text-field label="Grade Point(GP)" type="number"
                                              v-model="editInputs.gradePoint"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-form>
                    <v-layout row v-else-if="dialogIsOpenedFor=='save-list'" wrap>
                        <v-flex xs12>
                            <v-text-field label="List Name" type="text" v-model="saveListName"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <p class="text-xs-center" v-else-if="dialogIsOpenedFor=='delete'">Continuing will result in removing
                        the selected entry!</p>
                </v-card-text>

                <v-card-actions class="px-3 pb-3 pt-0">
                    <v-btn @click="cancel" class="normal-btn text-xs-left" color="blue-grey lighten-1" outline>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :color="dialogIsOpenedFor=='delete'? 'error' : 'primary'" @click.prevent="confirmAction()"
                           class="normal-btn" outline>
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog fullscreen hide-overlay lazy transition="dialog-bottom-transition" v-model="storedListDialog">
            <StoredList :storedListDialog.sync="storedListDialog" :subheader="headers" @generateCGPA="generateCGPAFromList"
                        v-if="!storedListDialogDestroy"></StoredList>
        </v-dialog>
    </div>
</template>

<script>
    import GradePointList from './GradePointList';
    import StoredList from './StoredList';
    import Storage from '../services/storage';

    const storage = new Storage();
    export default {
        name: 'Home',
        components: {
            StoredList,
            GradePointList
        },
        data() {
            return {
                credits: '',
                gradePoint: '',
                editInputs: {},
                cgpaList: [],
                total: {
                    credits: 0,
                    weightedGP: 0,
                    cgpa: 0,
                },
                headers: [
                    {
                        text: 'Credit(s)',
                        align: 'center',
                        sortable: false,
                        width: "10px"
                    },
                    {
                        text: 'GP',
                        align: 'center',
                        sortable: false,
                        width: "10px"
                    },
                    {
                        text: 'Weighted GP',
                        align: 'center',
                        sortable: false,
                        width: "10px"
                    },
                    {
                        text: 'Actions',
                        align: 'center',
                        sortable: false,
                        width: "10px"
                    },
                ],
                dialog: false,
                dialogIsOpenedFor: '',
                storedListDialog: false,
                storedListDialogDestroy: true,
                dialogDestroy: true,
                editedItem: null,
                saveListName: '',
            }
        },
        mounted() {
            let element = document.getElementsByClassName('bottom-fixed')[0];
            let bodyHeight = document.body.scrollHeight;
            let toolbarHeight = document.getElementsByClassName('v-toolbar')[0].offsetHeight;
            document.getElementById('cgpa-table').setAttribute('style', 'max-height: ' + (bodyHeight - element.offsetHeight - toolbarHeight) + 'px')
            // document.getElementsByClassName('v-table')[0].children[0].children[0].children[0].style.padding = 10
        },
        watch: {
            storedListDialog(value) {
                if (!value) {
                    let instance = this;
                    setTimeout(function () {
                        instance.storedListDialogDestroy = !instance.storedListDialogDestroy
                    }, 200)
                }
            },
            cgpaList() {
                this.calculateTotal();
            },
            dialog(value){
                if(!value) this.dialogIsOpenedFor= null
            }
        },
        methods: {
            generateCGPAFromList(value) {
                this.resetData();
                let instance = this;
                this.$nextTick(function () {
                    instance.total = value;
                })
            },
            saveCGPAListData() {
                if (this.saveListName && this.cgpaList.length > 1) {
                    let previousData = [];
                    let newData = {
                        id: null,
                        name: this.saveListName,
                        data: this.cgpaList
                    }

                    storage.get('cgpaList').then((value) => {
                        if (value != null) {
                            let data = JSON.parse(value);
                            console.log(data, 'cgpaList')
                            previousData = data;
                            if (data.length > 0) {
                                previousData = data;
                                newData.id = previousData[previousData.length - 1].id + 1;
                            }
                            //
                            // else{
                            //     let index = _.findIndex(previousData, {id: this.monthlyExpense.id});
                            //
                            //     previousData.splice(index, 1, this.monthlyExpense);
                            // }
                        } else {
                            newData.id = 1
                        }
                        previousData.push(newData)
                        this.saveToStorage(previousData);
                    });
                }
            },
            saveToStorage(data) {
                storage.set('cgpaList', JSON.stringify(data)).then((value) => {
                    this.saveListName = null;
                    this.dialog = false;
                    this.resetData();
                    this.clear()
                });

            },
            add() {
                if (this.credits && this.gradePoint) {
                    if (this.credits > 0 && (this.gradePoint >= 0 && this.gradePoint <= 4)) {
                        this.cgpaList.push({
                            id: this.cgpaList.length + 1,
                            credits: this.credits,
                            gradePoint: this.gradePoint,
                            weightedGP: (this.credits * this.gradePoint).toFixed(2)
                        });
                        this.gradePoint = ''
                    }
                }
            },
            calculateTotal() {
                this.total = {
                    credits: 0,
                    weightedGP: 0,
                    cgpa: 0,
                }
                if (this.cgpaList.length > 0) {
                    for (let i = 0; i < this.cgpaList.length; i++) {
                        this.total.credits += parseFloat(this.cgpaList[i].credits)
                        this.total.weightedGP += parseFloat(this.cgpaList[i].weightedGP)
                    }

                    this.total.cgpa = (this.total.weightedGP.toFixed(2) / this.total.credits).toFixed(2)
                }
            },
            confirmAction() {
                if (this.dialogIsOpenedFor == 'edit') {
                    this.updateCGPAList();
                } else if (this.dialogIsOpenedFor == 'delete') {
                    this.confirmDelete();
                } else if (this.dialogIsOpenedFor == 'save-list') {
                    this.saveCGPAListData();
                }
            },
            editItem(item) {

                this.dialogIsOpenedFor = 'edit'
                this.dialog = true
                this.editedIndex = this.cgpaList.indexOf(item)
                this.editInputs = Object.assign({}, item)
            },
            updateCGPAList() {
                this.editInputs.weightedGP = (this.editInputs.credits * this.editInputs.gpa).toFixed(2)
                Object.assign(this.cgpaList[this.editedIndex], this.editInputs)
                this.dialog = false;
                this.editedIndex = null;

            },
            deleteItem(item) {
                this.dialogIsOpenedFor = 'delete'
                this.dialog = true
                this.editedIndex = this.cgpaList.indexOf(item)

            },
            confirmDelete() {
                this.cgpaList.splice(this.editedIndex, 1)
                this.dialog = false
            },
            resetData() {
                this.cgpaList = [];
            },
            saveList() {
                this.dialog = true;
                this.dialogIsOpenedFor = 'save-list';

            },
            cancel() {
                this.dialog = false;
                if (this.dialogIsOpenedFor == 'save-list') {
                    this.saveListName = ''
                }
            },
            clear() {
                this.credits = '';
                this.gradePoint = ''
            },
            stored() {

                this.storedListDialog = true;
                this.storedListDialogDestroy = false;
            }

        }
    }
</script>

<style lang="scss">
    #cgpa-table {
        overflow-y: auto !important;
        border-radius: 6px;
    }

    .bottom-fixed {
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .v-card {
        border-radius: 6px;
        box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
    }

    .v-speed-dial {
        position: absolute;
    }

    .v-btn--floating {
        position: relative;
    }

    .normal-btn {
        border-radius: 2px;
    }

    .custom-btn-label {
        font-size: 9px;
        line-height: 0;
    }

    table.v-table thead th.column {
        padding: 0 16px !important;
    }

    /*.v-text-field__details{*/
    /*height: 0;*/
    /*}*/
</style>
