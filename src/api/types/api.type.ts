import { TUser, THoSoGiaoVien, THoSoHocSinh } from "@/shared/types/user.type";
import { TNamHoc, TMonHoc, TLopHoc } from "@/shared/types/academic.type";
import { TNganHangCauHoi, TDeKiemTra } from "@/shared/types/assessment.type";
import { TLichSuNopBai } from "@/shared/types/submission.type";
import { TKetQuaChamDiem } from "@/shared/types/grading.type";
import { TQueryConfig } from "@/shared/types/common.type";
import { TLoginRequest, TLoginResponse } from "@/shared/types/auth.type";
import { TCreateUserDto, TCreateTeacherDto, TCreateStudentDto, TCreateNamHocDto, TCreateMonHocDto, TCreateLopHocDto, TCreateQuestionDto, TCreateExamDto, TCreateSubmissionDto, TCreateGradingDto } from "@/shared/types/dto.type";
import { TBanner, TBaiViet, TBinhLuan, ELoaiBaiViet } from "@/shared/types/portal.type";
import { TQuyTrinh, TPhienQuyTrinh, TNhatKyPheDuyetQuyTrinh, TTruongFormQuyTrinh } from "@/shared/types/approval.type";
import {
    TCreateFlowDto,
    TAddFlowStepDto,
    TAddStepApproverDto,
    TCreateFlowFieldsDto,
    TSubmitFlowInstanceDto,
    TApproveStepDto
} from "@/shared/types/dto.type";

export type ApiQueryType = {
    // ... (rest remains same)
    getAllUsers: {
        url: { baseUrl: "/users"; queryParams?: TQueryConfig & { role?: string } };
        response: TUser[];
    };
    getProfile: {
        url: { baseUrl: "/auth/profile"; queryParams?: { userId: number } };
        response: TUser;
    };

    getUserById: {
        url: { baseUrl: "/users/:id"; urlParams: { id: number } };
        response: TUser;
    };

    // Portal
    getBanners: {
        url: { baseUrl: "/portal/banners"; queryParams?: { activeOnly?: boolean } };
        response: TBanner[];
    };
    getPosts: {
        url: { baseUrl: "/portal/posts"; queryParams?: { activeOnly?: boolean; type?: ELoaiBaiViet } };
        response: TBaiViet[];
    };
    getPostDetail: {
        url: { baseUrl: "/portal/posts/:slugOrId"; urlParams: { slugOrId: string | number } };
        response: TBaiViet;
    };
    getComments: {
        url: { baseUrl: "/portal/comments/post/:postId"; urlParams: { postId: number } };
        response: TBinhLuan[];
    };

    // Academic
    getNamHocs: {
        url: { baseUrl: "/academic/years"; queryParams?: TQueryConfig };
        response: TNamHoc[];
    };
    // ...
    getNamHocById: {
        url: { baseUrl: "/academic/years/:id"; urlParams: { id: number } };
        response: TNamHoc;
    };
    getMonHocs: {
        url: { baseUrl: "/academic/subjects"; queryParams?: TQueryConfig };
        response: TMonHoc[];
    };
    getMonHocById: {
        url: { baseUrl: "/academic/subjects/:id"; urlParams: { id: number } };
        response: TMonHoc;
    };
    getLopHocs: {
        url: { baseUrl: "/academic/classes"; queryParams?: TQueryConfig };
        response: TLopHoc[];
    };
    getLopHocById: {
        url: { baseUrl: "/academic/classes/:id"; urlParams: { id: number } };
        response: TLopHoc;
    };

    // Assessments
    getQuestions: {
        url: { baseUrl: "/assessments/questions"; queryParams?: TQueryConfig };
        response: TNganHangCauHoi[];
    };
    getQuestionById: {
        url: { baseUrl: "/assessments/questions/:id"; urlParams: { id: number } };
        response: TNganHangCauHoi;
    };
    getExams: {
        url: { baseUrl: "/assessments/exams"; queryParams?: TQueryConfig };
        response: TDeKiemTra[];
    };
    getExamById: {
        url: { baseUrl: "/assessments/exams/:id"; urlParams: { id: number } };
        response: TDeKiemTra;
    };

    // Submissions
    getSubmissions: {
        url: { baseUrl: "/submissions"; queryParams?: TQueryConfig };
        response: TLichSuNopBai[];
    };
    getSubmissionById: {
        url: { baseUrl: "/submissions/:id"; urlParams: { id: number } };
        response: TLichSuNopBai;
    };

    // Grading
    getGradings: {
        url: { baseUrl: "/grading"; queryParams?: TQueryConfig };
        response: TKetQuaChamDiem[];
    };
    getGradingById: {
        url: { baseUrl: "/grading/:id", urlParams: { id: number } };
        response: TKetQuaChamDiem;
    };
    // Calendar
    getCalendars: {
        url: { baseUrl: "/calendar" };
        response: any[];
    };
    getCalendarByClass: {
        url: { baseUrl: "/calendar/class/:id", urlParams: { id: number } };
        response: any[];
    };

    // Approvals
    getAllFlows: {
        url: { baseUrl: "/flow" };
        response: TQuyTrinh[];
    };
    getFlowFormFields: {
        url: { baseUrl: "/flow/:id/form-fields", urlParams: { id: number } };
        response: TTruongFormQuyTrinh[];
    };
    getMyFlows: {
        url: { baseUrl: "/my-flow", queryParams?: { status?: string } };
        response: TPhienQuyTrinh[];
    };
    getFlowInstance: {
        url: { baseUrl: "/flow-instance/:id", urlParams: { id: number } };
        response: TPhienQuyTrinh;
    };
    getFlowLogs: {
        url: { baseUrl: "/flow-instance/:id/logs", urlParams: { id: number } };
        response: TNhatKyPheDuyetQuyTrinh[];
    };
    getCategories: {
        url: { baseUrl: "/categories" };
        response: any[]; // Or specific category type if available
    };
};

export type ApiMutationType = {
    // Auth
    login: {
        url: { baseUrl: "/auth/login" };
        payload: TLoginRequest;
        response: TLoginResponse;
    };
    register: {
        url: { baseUrl: "/auth/register" };
        payload: { email: string; matKhau: string };
        response: { message: string };
    };
    forgotPassword: {
        url: { baseUrl: "/auth/forgot-password" };
        payload: { email: string };
        response: { message: string; resetToken?: string };
    };
    resetPassword: {
        url: { baseUrl: "/auth/reset-password" };
        payload: { token: string; matKhau: string };
        response: { message: string };
    };

    // Users
    createTeacher: {
        url: { baseUrl: "/users/teachers" };
        payload: TCreateTeacherDto;
        response: THoSoGiaoVien;
    };
    createStudent: {
        url: { baseUrl: "/users/students" };
        payload: TCreateStudentDto;
        response: THoSoHocSinh;
    };
    updateUser: {
        url: { baseUrl: "/users/:id"; urlParams: { id: number } };
        payload: Partial<TCreateUserDto>;
        response: TUser;
    };
    createUser: {
        url: { baseUrl: "/users" };
        payload: TCreateUserDto; // Ensure this DTO exists or use Partial<TCreateUserDto>
        response: TUser;
    };
    deleteUser: {
        url: { baseUrl: "/users/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };

    // Academic
    createYear: {
        url: { baseUrl: "/academic/years" };
        payload: TCreateNamHocDto;
        response: TNamHoc;
    };
    updateYear: {
        url: { baseUrl: "/academic/years/:id"; urlParams: { id: number } };
        payload: Partial<TCreateNamHocDto>;
        response: TNamHoc;
    };
    deleteYear: {
        url: { baseUrl: "/academic/years/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };
    createSubject: {
        url: { baseUrl: "/academic/subjects" };
        payload: TCreateMonHocDto;
        response: TMonHoc;
    };
    updateSubject: {
        url: { baseUrl: "/academic/subjects/:id"; urlParams: { id: number } };
        payload: Partial<TCreateMonHocDto>;
        response: TMonHoc;
    };
    deleteSubject: {
        url: { baseUrl: "/academic/subjects/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };
    createClass: {
        url: { baseUrl: "/academic/classes" };
        payload: TCreateLopHocDto;
        response: TLopHoc;
    };
    updateClass: {
        url: { baseUrl: "/academic/classes/:id"; urlParams: { id: number } };
        payload: Partial<TCreateLopHocDto>;
        response: TLopHoc;
    };
    deleteClass: {
        url: { baseUrl: "/academic/classes/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };

    // Assessments
    createQuestion: {
        url: { baseUrl: "/assessments/questions" };
        payload: TCreateQuestionDto;
        response: TNganHangCauHoi;
    };
    updateQuestion: {
        url: { baseUrl: "/assessments/questions/:id"; urlParams: { id: number } };
        payload: Partial<TCreateQuestionDto>;
        response: TNganHangCauHoi;
    };
    deleteQuestion: {
        url: { baseUrl: "/assessments/questions/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };
    createExam: {
        url: { baseUrl: "/assessments/exams" };
        payload: TCreateExamDto;
        response: TDeKiemTra;
    };
    updateExam: {
        url: { baseUrl: "/assessments/exams/:id"; urlParams: { id: number } };
        payload: Partial<TCreateExamDto>;
        response: TDeKiemTra;
    };
    deleteExam: {
        url: { baseUrl: "/assessments/exams/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };
    addQuestionToExam: {
        url: { baseUrl: "/assessments/exams/:id/questions"; urlParams: { id: number } };
        payload: { cauHoiId: number; thuTuCau?: number };
        response: any;
    };
    removeQuestionFromExam: {
        url: { baseUrl: "/assessments/exams/:id/questions/:questionId"; urlParams: { id: number; questionId: number } };
        payload: undefined;
        response: void;
    };

    // Submissions
    createSubmission: {
        url: { baseUrl: "/submissions" };
        payload: TCreateSubmissionDto;
        response: TLichSuNopBai;
    };
    submitAnswer: {
        url: { baseUrl: "/submissions/:id/answers"; urlParams: { id: number } };
        payload: { cauHoiId: number; cauTraLoiCuaHs: string };
        response: any;
    };

    // Grading
    createGrading: {
        url: { baseUrl: "/grading" };
        payload: TCreateGradingDto;
        response: TKetQuaChamDiem;
    };
    updateGrading: {
        url: { baseUrl: "/grading/:id"; urlParams: { id: number } };
        payload: Partial<TCreateGradingDto>;
        response: TKetQuaChamDiem;
    };
    // Portal
    createBanner: {
        url: { baseUrl: "/portal/banners" };
        payload: Partial<TBanner>;
        response: TBanner;
    };
    updateBanner: {
        url: { baseUrl: "/portal/banners/:id"; urlParams?: { id: number } };
        payload: Partial<TBanner> & { id: number };
        response: TBanner;
    };
    deleteBanner: {
        url: { baseUrl: "/portal/banners/:id"; urlParams?: { id: number } };
        payload: { id: number };
        response: void;
    };
    createPost: {
        url: { baseUrl: "/portal/posts" };
        payload: Partial<TBaiViet>;
        response: TBaiViet;
    };
    updatePost: {
        url: { baseUrl: "/portal/posts/:id"; urlParams?: { id: number } };
        payload: Partial<TBaiViet> & { id: number };
        response: TBaiViet;
    };
    deletePost: {
        url: { baseUrl: "/portal/posts/:id"; urlParams?: { id: number } };
        payload: { id: number };
        response: void;
    };
    createComment: {
        url: { baseUrl: "/portal/comments" };
        payload: { baiVietId: number; noiDung: string; binhLuanChaId?: number };
        response: TBinhLuan;
    };
    deleteComment: {
        url: { baseUrl: "/portal/comments/:id"; urlParams?: { id: number } };
        payload: { id: number };
        response: void;
    };
    // Upload
    uploadImage: {
        url: { baseUrl: "/upload/image" };
        payload: FormData;
        response: { url: string; public_id: string };
    };
    uploadAvatar: {
        url: { baseUrl: "/upload/avatar" };
        payload: FormData;
        response: { url: string; public_id: string };
    };
    // Calendar
    createCalendar: {
        url: { baseUrl: "/calendar" };
        payload: any;
        response: any;
    };
    updateCalendar: {
        url: { baseUrl: "/calendar/:id"; urlParams: { id: number } };
        payload: any;
        response: any;
    };
    deleteCalendar: {
        url: { baseUrl: "/calendar/:id"; urlParams: { id: number } };
        payload: undefined;
        response: void;
    };

    // Approvals
    createFlow: {
        url: { baseUrl: "/flow" };
        payload: TCreateFlowDto;
        response: TQuyTrinh;
    };
    updateFlow: {
        url: { baseUrl: "/flow/:id", urlParams: { id: number } };
        payload: Partial<TCreateFlowDto>;
        response: TQuyTrinh;
    };
    addFlowStep: {
        url: { baseUrl: "/flow/:id/step", urlParams: { id: number } };
        payload: TAddFlowStepDto;
        response: any;
    };
    addStepApprover: {
        url: { baseUrl: "/flow/:stepId/approver", urlParams: { stepId: number } };
        payload: TAddStepApproverDto;
        response: any;
    };
    createFlowFields: {
        url: { baseUrl: "/flow/:id/fields", urlParams: { id: number } };
        payload: TCreateFlowFieldsDto;
        response: any;
    };
    submitFlow: {
        url: { baseUrl: "/submit-flow" };
        payload: TSubmitFlowInstanceDto;
        response: TPhienQuyTrinh;
    };
    approveStep: {
        url: { baseUrl: "/flow-instance/:id/approve", urlParams: { id: number } };
        payload: TApproveStepDto;
        response: any;
    };
    rejectStep: {
        url: { baseUrl: "/flow-instance/:id/reject", urlParams: { id: number } };
        payload: TApproveStepDto;
        response: any;
    };
    createCategory: {
        url: { baseUrl: "/categories" };
        payload: { ten: string; moTa?: string };
        response: any;
    };
};
