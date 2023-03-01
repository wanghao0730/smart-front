<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="社团分类" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择社团类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.front_league_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="协会名称" prop="linkman">
        <el-input
          v-model="queryParams.linkman"
          placeholder="请输入协会名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="president">
        <el-input
          v-model="queryParams.president"
          placeholder="请输入协会负责人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="concat">
        <el-input
          v-model="queryParams.concat"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="社团描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入社团描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['front:league:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['front:league:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['front:league:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['front:league:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="leagueList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="社团类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.front_league_status"
            :value="scope.row.type"
          />
        </template>
      </el-table-column>
      <el-table-column label="协会名称" align="center" prop="linkman" />
      <el-table-column label="协会负责人" align="center" prop="president" />
      <el-table-column label="联系方式" align="center" prop="concat" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <!-- <el-table-column label="社团描述" align="center" prop="description" /> -->
      <el-table-column label="封面图书" align="center" prop="cover" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.cover" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="介绍图" align="center" prop="detail" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.detail" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['front:league:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['front:league:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学校社团对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="社团分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择社团类型">
            <el-option
              v-for="dict in dict.type.front_league_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协会名称" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入协会名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="president">
          <el-input v-model="form.president" placeholder="请输入协会负责人" />
        </el-form-item>
        <el-form-item label="联系方式" prop="concat">
          <el-input v-model="form.concat" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="社团描述" prop="description">
          <!-- <el-input v-model="form.description" placeholder="请输入社团描述" /> -->
          <editor v-model="form.description" :min-height="192" />
        </el-form-item>
        <el-form-item label="封面图片">
          <image-upload v-model="form.cover" :limit="1" />
        </el-form-item>
        <el-form-item label="多张介绍图">
          <image-upload v-model="form.detail" :limit="5" />
        </el-form-item>
        <el-form-item label="备注数据" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注数据" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLeague,
  getLeague,
  delLeague,
  addLeague,
  updateLeague,
} from "@/api/front/league";

export default {
  name: "League",
  dicts: ["front_league_status"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 学校社团表格数据
      leagueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        linkman: null,
        president: null,
        concat: null,
        email: null,
        description: null,
        cover: null,
        detail: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "字典类型不能为空", trigger: "change" },
        ],
        linkman: [
          { required: true, message: "协会名称不能为空", trigger: "blur" },
        ],
        president: [
          { required: true, message: "协会负责人不能为空", trigger: "blur" },
        ],
        concat: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "社团描述不能为空", trigger: "blur" },
        ],
        cover: [
          { required: true, message: "封面图片不能为空", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "多张图片不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询学校社团列表 */
    getList() {
      this.loading = true;
      listLeague(this.queryParams).then((response) => {
        this.leagueList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        type: null,
        linkman: null,
        president: null,
        concat: null,
        email: null,
        description: null,
        cover: null,
        detail: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加学校社团";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getLeague(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学校社团";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateLeague(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLeague(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除学校社团编号为"' + ids + '"的数据项？')
        .then(function () {
          return delLeague(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "front/league/export",
        {
          ...this.queryParams,
        },
        `league_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
