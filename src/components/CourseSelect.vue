<template>
  <div class="course-select">
    <Card>
    <Row>
      <Col span="12">
        <Row>
          <h2 style="position: absolute;left: 40%;top: 50%">或</h2>
          <Col span="12">
            <h2>选择学生：</h2>
            <el-select
              ref="student"
              v-model="studentID"
              filterable
              clearable
              remote
              placeholder="请输入关键词搜索"
              :remote-method="searchStudent"
              :loading="loading.students"
              @change="handleSelectStudent"
            >
              <el-option
                v-for="opt in options.students"
                :label="opt.username"
                :value="opt.id"
                :key="opt.id"
              >
                <span
                  >{{ opt.username
                  }}<span style="font-size: 14px"
                    >({{ opt.userid }})</span
                  ></span
                >
              </el-option>
            </el-select>
          </Col>
          <Col span="12">
            <h2>选择班级：</h2>
            <el-select
              ref="class"
              v-model="classID"
              filterable
              remote
              clearable
              placeholder="请输入关键词搜索"
              :remote-method="searchClass"
              :loading="loading.classes"
              @change="handleSelectClass"
            >
              <el-option
                v-for="opt in options.classes"
                :label="opt.name"
                :value="opt.id"
                :key="opt.id"
              ></el-option>
            </el-select>
          </Col>
        </Row>
      </Col>
      <Col span="12">
        <Row>
          <Col span="12">
            <h2>选择课程</h2>
            <el-select
              ref="course"
              v-model="courseID"
              filterable
              remote
              clearable
              placeholder="请输入关键词搜索"
              :remote-method="searchCourse"
              :loading="loading.courses"
              @change="handleSelectCourse"
            >
              <el-option
                v-for="opt in options.courses"
                :label="opt.name"
                :value="opt.id"
                :key="opt.id"
              >
                <span style="float: left"
                  >{{ opt.name
                  }}<span style="font-size: 14px"
                    >({{ opt.teachername }})</span
                  ></span
                >
                <span style="float: right">
                  <img :src="opt.cover" style="widht: 60px"></img>
                </span>
              </el-option>
            </el-select>
          </Col>
          <Col span="12">
            <el-button
              type="primary"
              style="margin-top: 31px"
              @click="selectCourse"
              :="btnLoading">
              确认选课
            </el-button>
          </Col>
        </Row>
      </Col>
    </Row>
    </Card>
    <Row style="margin-top: 10px" :gutter="16">
      <Col span="12">
        <Card>
          <p slot="title" class="card-title">{{ cardTitle.left ? `${cardTitle.left}的` : '' }}
          已选课程
          </p>
          <Row :gutter="8">
            <Col span="8" v-for="item in selectedCourses" :key="item.id">
              <div class="info-card">
                <h3>{{item.coursename}}</h3>
              </div>
            </Col>
          </Row>
          <el-pagination
            layout="total, prev, pager, next"
            :total="page.course.total"
            :page-size.sync="page.course.limit"
            :current-page.sync="page.course.page"
            @current-change="getSelectedCourses"
          ></el-pagination>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title" class="card-title">{{ cardTitle.right ? `${cardTitle.right}的` : '' }}
          已选课学生
          </p>
          <Row :gutter="8">
            <Col span="8" v-for="item in selectedStudents" :key="item.id">
              <div class="info-card">
                <h3>{{item.studentname}}</h3>
                <h4>{{item.studentwid}}</h4>
              </div>
            </Col>
          </Row>
          <el-pagination
            layout="total, prev, pager, next"
            :total="page.student.total"
            :page-size.sync="page.student.limit"
            :current-page.sync="page.student.page"
            @current-change="getSelectedStudents"
          ></el-pagination>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import { voidFunc } from '@/util';

export default {
  name: 'CourseSelect',
  data() {
    return {
      options: {
        students: [],
        classes: [],
        courses: [],
      },
      loading: {
        students: false,
        classes: false,
        courses: false,
      },
      cardTitle: {
        left: '',
        right: '',
      },
      page: {
        course: {
          page: 1,
          limit: 15,
          total: 0,
        },
        student: {
          page: 1,
          limit: 15,
          total: 0,
        },
      },
      btnLoading: false,
      studentID: undefined,
      classID: undefined,
      courseID: undefined,
      selectedCourses: [],
      selectedStudents: [],
      selectedStudentIDs: [],
      selectedCourseIDs: [],
      selectedClassIDs: [],
    };
  },
  methods: {
    async searchStudent(query) {
      if (query !== '') {
        const { selectedStudentIDs } = this;
        this.students = true;
        const params = {
          page: 1,
          limit: 1000,
          keyword: query,
          kind: 's',
        };
        const res = await this.$http('/api/user/filter', 'get', {
          params,
        }).catch(voidFunc);
        this.options.students =
          res?.data.filter(e => !selectedStudentIDs.includes(e.id)) || [];
        this.loading.students = false;
      } else {
        this.options.students = [];
      }
    },
    async searchClass(query) {
      if (query !== '') {
        const { selectedClassIDs } = this;
        this.loading.classes = true;
        const params = {
          page: 1,
          limit: 1000,
          keyword: query,
        };
        const res = await this.$http('/api/user/class', 'get', {
          params,
        }).catch(voidFunc);
        this.options.classes =
          res?.data.filter(e => !selectedClassIDs.includes(e.id)) || [];
        this.loading.classes = false;
      } else {
        this.options.classes = [];
      }
    },
    async searchCourse(query) {
      if (query !== '') {
        const { selectedCourseIDs } = this;
        this.loading.courses = true;
        const params = {
          page: 1,
          limit: 1000,
          keyword: query,
        };
        const res = await this.$http('/api/course/course', 'get', {
          params,
        }).catch(voidFunc);
        this.options.courses =
          res?.data.filter(e => !selectedCourseIDs.includes(e.id)) || [];
        this.loading.courses = false;
      } else {
        this.options.coruses = [];
      }
    },
    handleSelectStudent(val) {
      if (val) {
        this.classID = undefined;
        this.selectedCourses = [];
        this.page.course.total = 0;
        this.$nextTick(() => {
          this.cardTitle.left = this.$refs.student.selectedLabel;
        });
        this.getSelectedCourseByStudent();
      } else {
        this.selectedCourses = [];
        this.selectedCourseIDs = [];
        this.cardTitle.left = '';
        this.page.course.total = 0;
      }
    },
    handleSelectClass(val) {
      if (val) {
        this.studentID = undefined;
        this.selectedCourses = [];
        this.page.course.total = 0;
        this.$nextTick(() => {
          this.cardTitle.left = this.$refs.class.selectedLabel;
        });
        this.getSelectedCourseByClass();
      } else {
        this.selectedCourses = [];
        this.selectedCourseIDs = [];
        this.cardTitle.left = '';
        this.page.course.total = 0;
      }
    },
    handleSelectCourse(val) {
      if (val) {
        this.$nextTick(() => {
          this.cardTitle.right = this.$refs.course.selectedLabel;
        });
        this.getSelectedStudents();
      } else {
        this.selectedStudents = [];
        this.page.student.total = 0;
        this.cardTitle.right = '';
        this.selectedClassIDs = [];
        this.selectedStudentIDs = [];
      }
    },
    getSelectedCourses() {
      if (this.studentID) {
        this.getSelectedCourseByStudent();
      } else {
        this.getSelectedCourseByClass();
      }
    },
    async getSelectedCourseByStudent() {
      const { page, limit } = this.page.course;
      const params = {
        page,
        limit,
        studentid: this.studentID,
      };
      const res = await this.$http('/api/courseselect/courseselect', 'get', {
        params,
      }).catch(voidFunc);
      this.selectedCourses = res.data;
      this.page.course.total = res.total;
      this.selectedCourseIDs = res.data.map(e => e.courseid);
    },
    async getSelectedCourseByClass() {
      const { page, limit } = this.page.course;
      const params = {
        page,
        limit,
        classid: this.classID,
      };
      const res = await this.$http('/api/courseselect/class', 'get', {
        params,
      }).catch(voidFunc);
      this.selectedCourses = res.data;
      this.page.course.total = res.total;
      this.selectedCourseIDs = res.data.map(e => e.courseid);
    },
    async getSelectedStudents() {
      const { page, limit } = this.page.student;
      const params = {
        page,
        limit,
        courseid: this.courseID,
      };
      const res = await this.$http('/api/courseselect/courseselect', 'get', {
        params,
      }).catch(voidFunc);
      this.selectedStudents = res.data;
      this.page.student.total = res.total;
      this.selectedStudentIDs = res.data.map(e => e.studentid);
      this.selectedClassIDS = Array.from(
        new Set(res.data.map(e => e.classid)),
      );
    },
    async selectCourse() {
      const { courseID, classID, studentID } = this;
      if (!courseID || !(classID || studentID)) {
        this.$error('请正确填写!');
        return;
      }
      this.btnLoading = true;
      const data = {
        courseid: courseID,
      };
      if (classID) data.classid = classID;
      else data.studentid = studentID;
      const res = await this.$http('/api/courseselect/courseselect', 'post', { data }).catch(voidFunc);
      this.btnLoading = false;
      if (!res) {
        return;
      }
      this.$info('选课成功');
      this.cleanUp();
    },
    cleanUp() {
      this.courseID = undefined;
      this.classID = undefined;
      this.studentID = undefined;
      this.selectedStudents = [];
      this.selectedCourses = [];
      this.$emit('finish');
    },
  },
};
</script>
<style scoped>
.info-card {
  border: 1px solid;
  border-color: lightgrey;
  border-radius: 4px;
  padding: 2px;
  margin: 2px 0;
}
.course-select {
  margin-top: 20px;
}
</style>
