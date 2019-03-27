<template>
    <v-data-table :headers="headers" :items="dataArray" class="elevation-1" hide-actions>
        <template v-slot:items="props"  v-show="expanded">
            <td class="text-xs-center"> {{props.item.credits}}</td>
            <td class="text-xs-center"> {{props.item.gradePoint}}</td>
            <td class="text-xs-center"> {{props.item.weightedGP}}</td>
            <td class="justify-center layout px-0">
                <v-icon @click="editItem(props.item)" class="pa-2" icon outline small>edit</v-icon>
                <v-icon @click="deleteItem(props.item)" class="pa-2" icon outline small>delete</v-icon>
            </td>
        </template>
    </v-data-table>
</template>

<script>
    export default {
        name: "GradePointList",
        props:['headers','dataArray'],
        methods:{
            editItem(item){
                this.$emit('editGradePoint',item)
            },
            deleteItem(item){
                this.$emit('deleteGradePoint',item)
            }
        }
    }
</script>

<style scoped>

</style>
