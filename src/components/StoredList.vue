<template>
    <v-card flat height="100vh" color="#fafafa" class="border-rad-0">
        <v-toolbar>
            <div @click="$emit('update:storedListDialog', false)" icon v-ripple>
                <v-icon>arrow_back</v-icon>
            </div>
            <v-toolbar-title>Stored CGPA List</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
       <v-container>
           <v-data-table :headers="headers" :items="storedList" class="elevation-1 border-rad" hide-actions item-key="name">
               <template v-slot:items="props">
                   <td class="text-xs-center" @click="props.expanded = !props.expanded, subItems = props.item.data, expanded = !expanded"> <v-icon v-if="props.expanded">keyboard_arrow_down</v-icon> <v-icon v-else>keyboard_arrow_right</v-icon></td>
                   <td class="text-xs-center" @click="props.expanded = !props.expanded, subItems = props.item.data, expanded = !expanded"> {{props.item.name}}</td>
                   <td class="text-xs-center" @click="props.expanded = !props.expanded, subItems = props.item.data, expanded = !expanded"> {{storedListSingleCGPA(props.item.data)}}</td>
                   <!--<td class="text-xs-center"> {{props.item.cgpa}}</td>-->
                   <td class="justify-center layout px-0">
                       <!--<v-icon @click="editItem(props.item)" class="pa-2" icon outline small>edit</v-icon>-->
                       <v-icon @click="deleteItem(props.item)" class="pa-2" icon outline small>delete</v-icon>
                   </td>
               </template>
               <template slot="expand">
                   <GradePointList :headers="subheader" :dataArray="subItems" @editItem="editSubItem" @deleteItem="deleteSubItem"></GradePointList>
               </template>
           </v-data-table>
           <!--<v-card v-else>-->
               <!--<v-card-text>-->
                   <!--<p class=" ma-0 pa-3 text-xs-center">No data available</p>-->
               <!--</v-card-text>-->
           <!--</v-card>-->
       </v-container>
        <div class="bottom-fixed"  v-if="storedList.length> 0">
            <v-container class="text-xs-center">
                <v-btn @click.prevent="generateCGPAFromList()"  color="indigo" outline>
                    Generate CGPA
                </v-btn>
            </v-container>
        </div>

        <v-dialog max-width="500px" v-model="dialog">
            <v-card>
                <v-card-text>
                    <p class="body-2 ma-0 px-3 pt-3 text-xs-center">Are you sure?</p>
                    <p class="text-xs-center">Continuing will result in removing the selected data permanently!</p>
                </v-card-text>
                <v-card-actions class="px-3 pb-3 pt-0">
                    <v-btn @click="cancel" class="normal-btn text-xs-left" color="blue-grey lighten-1" outline>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click.prevent="confirmDelete()" class="normal-btn" color="error" outline>
                        <v-icon>check</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import GradePointList from './GradePointList';
    import Storage from '../services/storage';

    const storage = new Storage();
    export default {
        name: "StoredList",
        props:['subheader'],
        components:{
          GradePointList
        },
        data() {
            return {
                storedList: [],
                headers: [
                    {
                        text: '',
                        align: 'center',
                        sortable: false,
                        width: "10px"
                    },
                    {
                        text: 'Title',
                        align: 'center',
                        sortable: false,

                    },
                    {
                        text: 'CGPA',
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text: 'Actions',
                        align: 'center',
                        sortable: false,

                    },
                ],
                selectedIndex: null,
                dialog: false,
                subItems: [],
                expanded : false,
            }
        },
        mounted() {
            storage.get('cgpaList').then((value) => {
                console.log(JSON.parse(value), 'get value')
                this.storedList = JSON.parse(value);
            });
        },
        methods: {
            storedListSingleCGPA(data) {
                let credit = 0, gpa = 0
                for (let i = 0; i < data.length; i++) {
                    credit += parseFloat(data[i].credits)
                    gpa += parseFloat(data[i].weightedGP)
                }
                let cgpa = ((gpa.toFixed(2) / credit).toFixed(2))
                return cgpa;
            },
            // editItem(item) {
            //     this.dialogIsOpenedFor = 'edit'
            //     this.dialog = true
            //     this.selectedIndex = this.storedList.indexOf(item)
            //     this.editInputs = Object.assign({}, item)
            // },
            deleteItem(item) {
                this.dialog = true
                this.selectedIndex = this.storedList.indexOf(item)
            },
            confirmDelete() {
                this.storedList.splice(this.selectedIndex, 1)
                this.saveToStorage(this.storedList);
            },
            saveToStorage(data) {
                storage.set('cgpaList', JSON.stringify(data)).then((value) => {
                    this.dialog = false;
                    this.selectedIndex = null;
                });

            },
            cancel() {
                this.dialog = false
            },
            editSubItem(item){

                this.dialog = true
                this.selectedIndex = this.storedList.indexOf(item)
                this.editInputs = Object.assign({}, item)
            },
            deleteSubItem(item){

            },
            generateCGPAFromList(){
                let total = {
                    credits: 0,
                    weightedGP: 0,
                    cgpa: 0,
                }

                this.storedList.forEach(function (item) {
                    item.data.forEach(function(element){
                        total.credits +=parseFloat(element.credits);
                        total.weightedGP += parseFloat(element.weightedGP);
                    })
                });
                total.cgpa = (total.weightedGP / total.credits).toFixed(2)

                this.$emit('generateCGPA',total)
                this.$emit('update:storedListDialog',false)
            }
        },


    }
</script>

<style lang="scss">
    .border-rad-0{
        border-radius: 0px !important;
    }
    .border-rad{
        border-radius: 6px !important;
        table{
            border-radius: 6px !important;
        }
    }

</style>
