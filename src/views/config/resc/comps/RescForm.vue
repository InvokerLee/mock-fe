<template>
  <div v-loading="loading" class="resc-form">
    <el-form ref="rescForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="路径：" prop="rescPath">
        <el-input v-model.trim="form.rescPath"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select v-model="form.type" style="width: 100%;">
          <el-option v-for="item in METHOD_TYPES" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属系统：" prop="system">
        <el-select v-model="form.system" filterable style="width: 100%;">
          <el-option
            v-for="item in systemList"
            :key="item._id"
            :label="item.host"
            :value="item._id"
          ></el-option>
        </el-select>
        <span class="color-info">{{ selectedSysOrigin }}</span>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model.trim="form.rescName"></el-input>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script>
import { addResc, editResc } from '@/api/config/resc';
import { METHOD_TYPES } from '@/utils/constants';

export default {
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
    systemList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    this.METHOD_TYPES = METHOD_TYPES;
    return {
      loading: false,
      form: {
        rescName: '',
        rescPath: '',
        type: 'GET',
        system: '',
      },
      rules: {
        rescPath: [
          { required: true, message: '必填', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '必选项', trigger: 'blur' },
        ],
        system: [
          { required: true, message: '必选项', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    editId() {
      return this.row._id;
    },
    selectedSysOrigin() {
      const sys = this.systemList.find((v) => v._id === this.form.system);
      if (!sys) return '';
      const { scheme, port, ip } = sys;
      return `${scheme}://${ip}${port ? ':' + port : ''}`;
    },
  },
  created() {
    if (!this.editId) return;
    Object.keys(this.form).forEach((key) => {
      if (key !== 'system') {
        this.form[key] = this.row[key];
      }
    });
    this.form.system = this.row.system && this.row.system._id;
  },
  methods: {
    confirm() {
      this.$refs.rescForm.validate((valid) => {
        if (!valid) return;
        this.submit();
      });
    },
    async submit() {
      this.loading = true;
      const apiFn = this.editId ? editResc : addResc;
      const payload = this.editId ? { ...this.form, _id: this.editId } : this.form;
      const [err] = await apiFn(payload);
      this.loading = false;
      if (err) return;
      this.$message.success('保存成功');
      this.$emit('success');
      this.cancel();
    },
    cancel() {
      this.$emit('close');
    },
    handleSelect(item) {
      this.form.ip = item.ip;
    },
  },
};
</script>

<style lang="scss" scoped>
.resc-form {
  .footer {
    text-align: right;
    padding-top: 24px;
  }
}
</style>
