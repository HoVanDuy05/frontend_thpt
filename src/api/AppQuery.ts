import { useAppQuery, AppQueryOptions } from "./hooks/useAppQuery";
import { ApiQueryType } from "./types/api.type";
import { TQueryConfig } from "@/shared/types/common.type";
import { ELoaiBaiViet } from "@/shared/types/portal.type";

export const AppQuery = {
    auth: {
        useProfile: (options?: AppQueryOptions<"getProfile">) =>
            useAppQuery({ url: { baseUrl: "/auth/profile" }, options }),
        useNotifications: (options?: AppQueryOptions<"getNotifications">) =>
            useAppQuery({ url: { baseUrl: "/communication/notifications" }, options }),
    },
    user: {

        useList: (params?: TQueryConfig & { role?: string }, options?: AppQueryOptions<"getAllUsers">) =>
            useAppQuery({ url: { baseUrl: "/users", queryParams: params }, options }),
        useDetail: (id: number, options?: AppQueryOptions<"getUserById">) =>
            useAppQuery({ url: { baseUrl: "/users/:id", urlParams: { id } }, options }),
    },
    academic: {
        useYears: (params?: TQueryConfig, options?: AppQueryOptions<"getNamHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/years", queryParams: params }, options }),
        useYearDetail: (id: number, options?: AppQueryOptions<"getNamHocById">) =>
            useAppQuery({ url: { baseUrl: "/academic/years/:id", urlParams: { id } }, options }),
        useHocKys: (params?: TQueryConfig & { namHocId?: number }, options?: AppQueryOptions<"getHocKys">) =>
            useAppQuery({ url: { baseUrl: "/academic/semesters", queryParams: params }, options }),
        useHocKyDetail: (id: number, options?: AppQueryOptions<"getHocKyById">) =>
            useAppQuery({ url: { baseUrl: "/academic/semesters/:id", urlParams: { id } }, options }),
        useSubjects: (params?: TQueryConfig, options?: AppQueryOptions<"getMonHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/subjects", queryParams: params }, options }),
        useClasses: (params?: TQueryConfig, options?: AppQueryOptions<"getLopHocs">) =>
            useAppQuery({ url: { baseUrl: "/academic/classes", queryParams: params }, options }),
        useClassYears: (params?: TQueryConfig & { namHocId?: number }, options?: AppQueryOptions<"getLopNams">) =>
            useAppQuery({ url: { baseUrl: "/academic/class-years", queryParams: params }, options }),
        useKhois: (params?: TQueryConfig, options?: AppQueryOptions<"getKhois">) =>
            useAppQuery({ url: { baseUrl: "/academic/grades", queryParams: params }, options }),
        useKhoiDetail: (id: number, options?: AppQueryOptions<"getKhoiById">) =>
            useAppQuery({ url: { baseUrl: "/academic/grades/:id", urlParams: { id } }, options }),
        useAssignments: (params?: TQueryConfig & { giaoVienId?: number; monHocId?: number; lopNamId?: number; namHocId?: number }, options?: AppQueryOptions<"getAssignments">) =>
            useAppQuery({ url: { baseUrl: "/academic/assignments", queryParams: params }, options }),
        useAssignmentDetail: (id: number, options?: AppQueryOptions<"getAssignmentById">) =>
            useAppQuery({ url: { baseUrl: "/academic/assignments/:id", urlParams: { id } }, options }),
        useGradeRecords: (params?: TQueryConfig & { hocSinhId?: number; monHocId?: number; hocKyId?: number }, options?: AppQueryOptions<"getGradeRecords">) =>
            useAppQuery({ url: { baseUrl: "/academic/grades-records", queryParams: params }, options }),
        useGradeRecordDetail: (id: number, options?: AppQueryOptions<"getGradeRecordById">) =>
            useAppQuery({ url: { baseUrl: "/academic/grades-records/:id", urlParams: { id } }, options }),
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
        useCategories: (options?: AppQueryOptions<"getCategories">) =>
            useAppQuery({ url: { baseUrl: "/categories" }, options }),
        useFlows: (options?: AppQueryOptions<"getAllFlows">) =>
            useAppQuery({ url: { baseUrl: "/flow" }, options }),
        useFormFields: (id: number, options?: AppQueryOptions<"getFlowFormFields">) =>
            useAppQuery({ url: { baseUrl: "/flow/:id/form-fields", urlParams: { id } }, options }),
        usePending: (options?: AppQueryOptions<"getPendingApprovals">) =>
            useAppQuery({ url: { baseUrl: "/pending" }, options }),
        useMyFlows: (status?: string, options?: AppQueryOptions<"getMyFlows">) =>
            useAppQuery({ url: { baseUrl: "/my-flow", queryParams: { status } }, options }),
        useInstance: (id: number, options?: AppQueryOptions<"getFlowInstance">) =>
            useAppQuery({ url: { baseUrl: "/flow-instance/:id", urlParams: { id } }, options }),
        useLogs: (id: number, options?: AppQueryOptions<"getFlowLogs">) =>
            useAppQuery({ url: { baseUrl: "/flow-instance/:id/logs", urlParams: { id } }, options }),
    },
    social: {
        useFeed: (params?: { limit?: number; cursor?: number }, options?: AppQueryOptions<"getSocialFeed">) =>
            useAppQuery({ url: { baseUrl: "/social/feed", queryParams: params }, options }),
        useUserThreads: (userId: number, params?: { limit?: number; cursor?: number }, options?: AppQueryOptions<"getSocialUserThreads">) =>
            useAppQuery({ url: { baseUrl: "/social/users/:id/threads", urlParams: { id: userId }, queryParams: params }, options }),
        useSearch: (q: string, params?: { limit?: number }, options?: AppQueryOptions<"getSocialSearch">) =>
            useAppQuery({ url: { baseUrl: "/social/search", queryParams: { q, ...params } }, options }),
        useSocialProfile: (id: number, options?: AppQueryOptions<"getSocialProfile">) =>
            useAppQuery({ url: { baseUrl: "/social/profile/:id", urlParams: { id } }, options }),
        useActivity: (params?: { limit?: number }, options?: AppQueryOptions<"getSocialActivity">) =>
            useAppQuery({ url: { baseUrl: "/social/activity", queryParams: params }, options }),
        useThreadDetail: (id: number, options?: AppQueryOptions<"getThreadDetail">) =>
            useAppQuery({ url: { baseUrl: "/social/threads/:id", urlParams: { id } }, options }),
        useTrending: (options?: AppQueryOptions<"getTrending">) =>
            useAppQuery({ url: { baseUrl: "/social/trending" }, options }),
        useSuggestedUsers: (params?: { limit?: number }, options?: AppQueryOptions<"getSuggestedUsers">) =>
            useAppQuery({ url: { baseUrl: "/social/suggested-users", queryParams: params }, options }),
    },
    friends: {
        useSearch: (q: string, options?: AppQueryOptions<"searchFriends">) =>
            useAppQuery({ url: { baseUrl: "/friends/search", queryParams: { q } }, options }),
        useList: (options?: AppQueryOptions<"getFriends">) =>
            useAppQuery({ url: { baseUrl: "/friends" }, options }),
        usePending: (options?: AppQueryOptions<"getPendingFriends">) =>
            useAppQuery({ url: { baseUrl: "/friends/pending" }, options }),
        useStatus: (id: number, options?: AppQueryOptions<"getFriendStatus">) =>
            useAppQuery({ url: { baseUrl: "/friends/status/:id", urlParams: { id } }, options }),
        useReceivedRequests: (options?: AppQueryOptions<"getReceivedRequests">) =>
            useAppQuery({ url: { baseUrl: "/social/friend-requests/received" }, options }),
        useSentRequests: (options?: AppQueryOptions<"getSentRequests">) =>
            useAppQuery({ url: { baseUrl: "/social/friend-requests/sent" }, options }),
    },
    chat: {
        useChannels: (options?: AppQueryOptions<"getChannels">) =>
            useAppQuery<"getChannels">({ url: { baseUrl: "/communication/chat/channels" }, options }),
        useMessages: (channelId: number, params?: { page?: number }, options?: AppQueryOptions<"getMessages">) =>
            useAppQuery<"getMessages">({
                url: { baseUrl: "/communication/chat/channels/:id/messages", urlParams: { id: channelId }, queryParams: params },
                options: {
                    ...options,
                    queryKey: ["chat", "messages", channelId, params?.page || 1, ...(options?.queryKey || [])],
                },
                refetchInterval: options?.refetchInterval
            }),
    },
};

// --- Student Management Hooks ---
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "./axiosClient";
import { notifications } from "@mantine/notifications";

export const useGetAvailableStudents = (yearId: number | undefined, options?: AppQueryOptions<"getAvailableStudents">) => {
    return useAppQuery<"getAvailableStudents">({
        url: { baseUrl: "/academic/years/:yearId/available-students", urlParams: { yearId: yearId! } },
        options: { ...options, enabled: !!yearId && options?.enabled !== false }
    });
};

export const useAddStudentsToClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ classId, studentIds }: { classId: number; studentIds: number[] }) => {
            const { data } = await axiosClient.post(`/academic/classes/${classId}/students`, { studentIds });
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate with the correct query key format used by useAppQuery
            queryClient.invalidateQueries({ queryKey: ['/academic/class-years'] }); // Refresh class lists
            queryClient.invalidateQueries({ queryKey: ['/academic/years'] }); // Refresh available students list
            notifications.show({
                title: 'Thành công',
                message: 'Đã thêm học sinh vào lớp',
                color: 'green',
            });
        },
        onError: (error: any) => {
            notifications.show({
                title: 'Thất bại',
                message: error?.response?.data?.message || 'Có lỗi xảy ra',
                color: 'red',
            });
        },
    });
};
