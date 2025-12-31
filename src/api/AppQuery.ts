import { useAppQuery, AppQueryOptions } from "./hooks/useAppQuery";
import { ApiQueryType } from "./types/api.type";
import { TQueryConfig } from "@/shared/types/common.type";
import { ELoaiBaiViet } from "@/shared/types/portal.type";

export const AppQuery = {
    auth: {
        useProfile: (options?: AppQueryOptions<"getProfile">) =>
            useAppQuery({ url: { baseUrl: "/auth/profile" }, options }),
    },
    user: {

        useList: (params?: TQueryConfig, options?: AppQueryOptions<"getAllUsers">) =>
            useAppQuery({ url: { baseUrl: "/users", queryParams: params }, options }),
        useDetail: (id: number, options?: AppQueryOptions<"getUserById">) =>
            useAppQuery({ url: { baseUrl: "/users/:id", urlParams: { id } }, options }),
    },
    academic: {
        useYears: (params?: TQueryConfig, options?: AppQueryOptions<"getNamHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/years", queryParams: params }, options }),
        useSubjects: (params?: TQueryConfig, options?: AppQueryOptions<"getMonHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/subjects", queryParams: params }, options }),
        useClasses: (params?: TQueryConfig, options?: AppQueryOptions<"getLopHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/classes", queryParams: params }, options }),
    },
    calendar: {
        useList: (options?: AppQueryOptions<"getCalendars">) =>
            useAppQuery({ url: { baseUrl: "/calendar" }, options }),
        useByClass: (id: number, options?: AppQueryOptions<"getCalendarByClass">) =>
            useAppQuery({ url: { baseUrl: "/calendar/class/:id", urlParams: { id } }, options }),
    },
    assessment: {
        useQuestions: (params?: TQueryConfig, options?: AppQueryOptions<"getQuestions">) =>
            useAppQuery({ url: { baseUrl: "/assessments/questions", queryParams: params }, options }),
        useExams: (params?: TQueryConfig, options?: AppQueryOptions<"getExams">) =>
            useAppQuery({ url: { baseUrl: "/assessments/exams", queryParams: params }, options }),
        useExamDetail: (id: number, options?: AppQueryOptions<"getExamById">) =>
            useAppQuery({ url: { baseUrl: "/assessments/exams/:id", urlParams: { id } }, options }),
    },
    submission: {
        useList: (params?: TQueryConfig, options?: AppQueryOptions<"getSubmissions">) =>
            useAppQuery({ url: { baseUrl: "/submissions", queryParams: params }, options }),
        useDetail: (id: number, options?: AppQueryOptions<"getSubmissionById">) =>
            useAppQuery({ url: { baseUrl: "/submissions/:id", urlParams: { id } }, options }),
    },
    grading: {
        useList: (params?: TQueryConfig, options?: AppQueryOptions<"getGradings">) =>
            useAppQuery({ url: { baseUrl: "/grading", queryParams: params }, options }),
    },
    portal: {
        useBanners: (activeOnly?: boolean, options?: AppQueryOptions<"getBanners">) =>
            useAppQuery({ url: { baseUrl: "/portal/banners", queryParams: { activeOnly } }, options }),
        usePosts: (params?: { activeOnly?: boolean; type?: ELoaiBaiViet }, options?: AppQueryOptions<"getPosts">) =>
            useAppQuery({ url: { baseUrl: "/portal/posts", queryParams: params }, options }),
        usePostDetail: (slugOrId: string | number, options?: AppQueryOptions<"getPostDetail">) =>
            useAppQuery({ url: { baseUrl: "/portal/posts/:slugOrId", urlParams: { slugOrId } }, options }),
        useComments: (postId: number, options?: AppQueryOptions<"getComments">) =>
            useAppQuery({ url: { baseUrl: "/portal/comments/post/:postId", urlParams: { postId } }, options }),
    },
    approvals: {
        useFlows: (options?: AppQueryOptions<"getAllFlows">) =>
            useAppQuery({ url: { baseUrl: "/flow" }, options }),
        useFormFields: (id: number, options?: AppQueryOptions<"getFlowFormFields">) =>
            useAppQuery({ url: { baseUrl: "/flow/:id/form-fields", urlParams: { id } }, options }),
        useMyFlows: (status?: string, options?: AppQueryOptions<"getMyFlows">) =>
            useAppQuery({ url: { baseUrl: "/my-flow", queryParams: { status } }, options }),
        useInstance: (id: number, options?: AppQueryOptions<"getFlowInstance">) =>
            useAppQuery({ url: { baseUrl: "/flow-instance/:id", urlParams: { id } }, options }),
        useLogs: (id: number, options?: AppQueryOptions<"getFlowLogs">) =>
            useAppQuery({ url: { baseUrl: "/flow-instance/:id/logs", urlParams: { id } }, options }),
    }
};
