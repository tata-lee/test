<template>
  <div class="main">
  <Card>
    <div class="student-item" v-for="(item,index) in students" :key="item.userid">
      <span>学号</span>
      <el-input class="input" size="mini" v-model="item.userid"></el-input>
      <span>姓名</span>
      <el-input class="input" size="mini" v-model="item.name"></el-input>
      <div style="display: inline-flex;">
        <el-button class="btn left" @click="handleDelete(index)" size="mini">-</el-button>
        <el-button class="btn right" @click="handleAdd()" size="mini">
          <span style="margin-left: -5px">+</span>
        </el-button>
      </div>
    </div>
    <el-button v-if="students.length === 0" @click="handleAdd()">+</el-button>
  </Card>
  </div>
</template>
<script>
import * as xlsx from 'xlsx';

export default {
  data() {
    return {
      students: [
      ],
    };
  },
  methods: {
    handleDelete(index) {
      this.students.splice(index, 1);
    },
    handleAdd() {
      this.students.push({
        userid: '1111',
        name: '111',
      });
    },
    handleUpload(file) {
      const reader = new FileReader();
      reader.onload((e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, {
          type: 'binary',
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const ret = xlsx.utils.sheet_to_json();
      });
    },
  },
};
</script>
<style scoped>
.student-item {
  margin: 2px 0;
}
.input {
  width: 100px;
}
.btn {
  width: 30px;
  height: 30px;
  margin: 0;
}
.left {
  border-radius: 15px 0 0 15px ;
}
.right {
  border-radius: 0 15px 15px 0;
  border-left: none;
}
</style>
