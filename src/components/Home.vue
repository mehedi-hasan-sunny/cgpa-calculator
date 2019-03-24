<template>
    <div>
        <v-container id="cgpa-table-container">
            <v-data-table :headers="headers" :items="cgpaList" class="elevation-1" hide-actions id="cgpa-table">
                <template v-slot:items="props">
                    <td class="text-xs-center"> {{props.item.credit}}</td>
                    <td class="text-xs-center"> {{props.item.gpa}}</td>
                    <td class="text-xs-center"> {{props.item.cgpa}}</td>
                    <td class="justify-center layout px-0">
                        <v-icon @click="editItem(props.item)" class="pa-2" icon outline small>edit</v-icon>
                        <v-icon @click="deleteItem(props.item)" class="pa-2" icon outline small>delete</v-icon>
                    </td>
                </template>
            </v-data-table>
        </v-container>
        <div class="bottom-fixed">
            <v-container>
                <v-card class="my-3 ">
                    <div class="text-xs-center">
                        <v-layout align-center justify-space-between pt-2 row wrap>
                            <v-flex class="caption">Total Credit(s) : {{ total.credit }}</v-flex>
                            <v-flex class="caption">Total Weighted GP : {{total.gpa}}</v-flex>
                        </v-layout>
                        <p class="display-2 pa-2 mb-0">CGPA: {{total.cgpa}}</p>
                    </div>
                </v-card>
                <v-card>

                    <v-container>
                        <v-form>
                            <v-layout row wrap>
                                <v-flex pr-2 xs6>
                                    <v-text-field label="Credit(s)" type="number" v-model="credit"></v-text-field>
                                </v-flex>
                                <v-flex pl-2 xs6>
                                    <v-text-field label="Grade Point(GP)" type="number" v-model="gpa"></v-text-field>
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
                                    <v-btn @click.prevent="stored" class="normal-btn" color="cyan accent-3" icon outline>
                                        <v-icon>storage</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label cyan--text text--accent-3">Stored</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="resetData()" class="normal-btn" color="blue-grey lighten-1"
                                           icon outline>
                                        <v-icon>cached</v-icon>
                                    </v-btn>
                                    <div class="custom-btn-label blue-grey--text text--lighten-1">Reset</div>
                                </div>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn @click.prevent="clear" class="normal-btn" color="error" icon
                                           outline>
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
                <p class="body-2 ma-0 px-3 pt-3 text-xs-center" v-else-if="dialogIsOpenedFor=='save-list'">Save CGPA
                    List</p>

                <v-card-text>
                    <v-form v-if="dialogIsOpenedFor=='edit'">
                        <v-layout row wrap>
                            <v-flex pr-2 xs6>
                                <v-text-field :autofocus='true' label="Credit(s)" type="number"
                                              v-model="editInputs.credit"></v-text-field>
                            </v-flex>
                            <v-flex pl-2 xs6>
                                <v-text-field label="Grade Point(GP)" type="number"
                                              v-model="editInputs.gpa"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-form>
                    <v-layout row wrap v-else-if="dialogIsOpenedFor=='save-list'">
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
                    <v-btn @click.prevent="confirmAction()" class="normal-btn" color="primary" outline>
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import Storage from '../services/storage';

    const storage = new Storage();
    export default {
        name: 'Home',
        data() {
            return {
                dialog: false,
                dialogIsOpenedFor: '',
                credit: '',
                gpa: '',
                editInputs: {},
                cgpaList: [],
                total: {
                    credit: 0,
                    gpa: 0,
                    cgpa: 0,
                },
                headers: [
                    {
                        text: 'Credit(s)',
                        align: 'center',
                        sortable: false,
                        width: "1%"
                    },
                    {
                        text: 'GP',
                        align: 'center',
                        sortable: false,
                        width: "1%"
                    },
                    {
                        text: 'Weighted GP',
                        align: 'center',
                        sortable: false,
                        width: "1%"
                    },
                    {
                        text: 'Actions',
                        align: 'center',
                        sortable: false,
                        width: "1%"
                    },
                ],
                editedItem: null,
                saveListName: '',
            }
        },
        mounted() {
            let element = document.getElementsByClassName('bottom-fixed')[0];
            document.getElementById('cgpa-table').setAttribute('style', 'max-height: ' + (document.body.scrollHeight - element.offsetHeight - document.getElementsByClassName('v-toolbar')[0].offsetHeight) + 'px')
            document.getElementsByClassName('v-table')[0].children[0].children[0].children[0].style.padding = 10
        },
        methods: {
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
                        }
                        else{
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
                    this.cgpaList = []
                    this.calculateTotal()
                    this.clear()
                });

            },
            add() {
                if (this.gpa && this.credit) {
                    this.cgpaList.push({
                        id: this.cgpaList.length + 1,
                        credit: this.credit,
                        gpa: this.gpa,
                        cgpa: (this.credit * this.gpa).toFixed(2)
                    });
                    this.gpa = ''
                    // this.credit = ''
                    this.calculateTotal();
                }
            },
            calculateTotal() {
                this.total = {
                    credit: 0,
                    gpa: 0,
                    cgpa: 0,
                }
                if (this.cgpaList.length > 0) {
                    for (let i = 0; i < this.cgpaList.length; i++) {
                        this.total.credit += parseFloat(this.cgpaList[i].credit)
                        this.total.gpa += parseFloat(this.cgpaList[i].cgpa)
                    }
                    this.total.cgpa = (this.total.gpa.toFixed(2) / this.total.credit).toFixed(2)
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
                this.editInputs.cgpa = (this.editInputs.credit * this.editInputs.gpa).toFixed(2)
                Object.assign(this.cgpaList[this.editedIndex], this.editInputs)
                this.calculateTotal();
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
                this.calculateTotal();
                this.dialog = false
            },
            resetData() {
                this.cgpaList = [];
                this.calculateTotal()
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
            clear(){
                this.credit='';
                this.gpa=''
            },
            stored(){
                storage.get('cgpaList').then((value) => {
                    console.log(JSON.parse(value), 'get value')
                });
            }

        },

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
