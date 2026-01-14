import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/providers/store/useAppStore";
import { useAppMutation } from "./hooks/useAppMutation";

export const AppMutation = () => {
    const queryClient = useQueryClient();
    const { setToken } = useAppStore();

    return {
        auth: {
            useLogin: () => useAppMutation<"login">({
                url: { baseUrl: "/auth/login" },
                onSuccess: (data) => {
                    setToken(data.access_token);
                }
            }),
            useRegister: () => useAppMutation<"register">({
                url: { baseUrl: "/auth/register" }
            }),
            useForgotPassword: () => useAppMutation<"forgotPassword">({
                url: { baseUrl: "/auth/forgot-password" }
            }),
            useResetPassword: () => useAppMutation<"resetPassword">({
                url: { baseUrl: "/auth/reset-password" }
            }),
            useVerifyCode: () => useAppMutation<"verifyCode">({
                url: { baseUrl: "/auth/verify" },
                method: "POST"
            }),
            useResendCode: () => useAppMutation<"resendCode">({
                url: { baseUrl: "/auth/resend-code" },
                method: "POST"
            }),
            useUpdateProfile: () => useAppMutation<"updateProfile">({
                url: { baseUrl: "/auth/profile" },
                method: "PATCH",
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: ["/auth/profile"] as any });
                    if (data?.id) {
                        queryClient.invalidateQueries({ queryKey: [`/social/profile/${data.id}`] as any });
                    }
                }
            }),
            useUploadAvatar: () => useAppMutation<"uploadAvatar">({
                url: { baseUrl: "/auth/avatar" },
                method: "POST",
                onSuccess: (data) => {
                    queryClient.invalidateQueries({ queryKey: ["/auth/profile"] as any });
                    if (data?.id) {
                        queryClient.invalidateQueries({ queryKey: [`/social/profile/${data.id}`] as any });
                    }
                }
            }),
        },
        notifications: {
            useMarkAsRead: (id: number) => useAppMutation<"markNotificationAsRead">({
                url: { baseUrl: "/communication/notifications/:id/read", urlParams: { id } },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/communication/notifications"] as any });
                }
            }),
            useMarkAllAsRead: () => useAppMutation<"markAllNotificationsAsRead">({
                url: { baseUrl: "/communication/notifications/read-all" },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/communication/notifications"] as any });
                }
            }),
        },
        user: {
            useUpdate: (id: number) => useAppMutation<"updateUser">({
                url: { baseUrl: "/users/:id", urlParams: { id } },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/users"] as any });
                }
            }),
            useDelete: (id: number) => useAppMutation<"deleteUser">({
                url: { baseUrl: "/users/:id", urlParams: { id } },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/users"] as any });
                }
            }),
            useCreateTeacher: () => useAppMutation<"createTeacher">({
                url: { baseUrl: "/users/teachers" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/users"] as any });
                }
            }),
            useCreateStudent: () => useAppMutation<"createStudent">({
                url: { baseUrl: "/users/students" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/users"] as any });
                }
            }),
            useCreateUser: () => useAppMutation<"createUser">({
                url: { baseUrl: "/users" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/users"] as any });
                }
            }),
        },
        academic: {
            useCreateYear: () => useAppMutation<"createYear">({
                url: { baseUrl: "/academic/years" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/academic/years"] as any });
                }
            }),
            useCreateSubject: () => useAppMutation<"createSubject">({
                url: { baseUrl: "/academic/subjects" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/academic/subjects"] as any });
                }
            }),
            useCreateClass: () => useAppMutation<"createClass">({
                url: { baseUrl: "/academic/classes" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/academic/classes"] as any });
                }
            }),
            useCreateCalendar: () => useAppMutation<"createCalendar">({
                url: { baseUrl: "/calendar" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/calendar"] as any });
                }
            }),
            useUpdateCalendar: (id: number) => useAppMutation<"updateCalendar">({
                url: { baseUrl: "/calendar/:id", urlParams: { id } },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/calendar"] as any });
                }
            }),
            useDeleteCalendar: (id: number) => useAppMutation<"deleteCalendar">({
                url: { baseUrl: "/calendar/:id", urlParams: { id } },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/calendar"] as any });
                }
            }),
        },
        assessment: {
            useCreateQuestion: () => useAppMutation<"createQuestion">({
                url: { baseUrl: "/assessments/questions" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/assessments/questions"] as any });
                }
            }),
            useCreateExam: () => useAppMutation<"createExam">({
                url: { baseUrl: "/assessments/exams" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/assessments/exams"] as any });
                }
            }),
        },
        submission: {
            useCreate: () => useAppMutation<"createSubmission">({
                url: { baseUrl: "/submissions" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/submissions"] as any });
                }
            }),
        },
        grading: {
            useCreate: () => useAppMutation<"createGrading">({
                url: { baseUrl: "/grading" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/grading"] as any });
                }
            }),
        },
        portal: {
            useCreateBanner: () => useAppMutation<"createBanner">({
                url: { baseUrl: "/portal/banners" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/banners"] as any });
                }
            }),
            useUpdateBanner: () => useAppMutation<"updateBanner">({
                url: { baseUrl: "/portal/banners/:id" },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/banners"] as any });
                }
            }),
            useDeleteBanner: () => useAppMutation<"deleteBanner">({
                url: { baseUrl: "/portal/banners/:id" },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/banners"] as any });
                }
            }),
            useCreatePost: () => useAppMutation<"createPost">({
                url: { baseUrl: "/portal/posts" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/posts"] as any });
                }
            }),
            useUpdatePost: () => useAppMutation<"updatePost">({
                url: { baseUrl: "/portal/posts/:id" },
                method: "PATCH",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/posts"] as any });
                }
            }),
            useDeletePost: () => useAppMutation<"deletePost">({
                url: { baseUrl: "/portal/posts/:id" },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/posts"] as any });
                }
            }),
            useCreateComment: () => useAppMutation<"createComment">({
                url: { baseUrl: "/portal/comments" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/comments"] as any });
                }
            }),
            useDeleteComment: () => useAppMutation<"deleteComment">({
                url: { baseUrl: "/portal/comments/:id" },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/portal/comments"] as any });
                }
            }),
        },
        upload: {
            useUploadImage: () => useAppMutation<"uploadImage">({
                url: { baseUrl: "/upload/image" },
            }),
            useUploadAvatar: () => useAppMutation<"uploadAvatar">({
                url: { baseUrl: "/auth/avatar" },
            }),
            useUploadAudio: () => useAppMutation<"uploadAudio">({
                url: { baseUrl: "/upload/audio" },
            }),
        },
        approvals: {
            useCreateFlow: () => useAppMutation<"createFlow">({
                url: { baseUrl: "/flow" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow"] as any });
                }
            }),
            useUpdateFlow: (id: number) => useAppMutation<"updateFlow">({
                url: { baseUrl: "/flow/:id", urlParams: { id } },
                method: "PUT",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow"] as any });
                }
            }),
            useAddStep: (id: number) => useAppMutation<"addFlowStep">({
                url: { baseUrl: "/flow/:id/step", urlParams: { id } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow"] as any });
                }
            }),
            useAddApprover: (stepId: number) => useAppMutation<"addStepApprover">({
                url: { baseUrl: "/flow/:stepId/approver", urlParams: { stepId } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow"] as any });
                }
            }),
            useCreateFields: (id: number) => useAppMutation<"createFlowFields">({
                url: { baseUrl: "/flow/:id/fields", urlParams: { id } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow"] as any });
                }
            }),
            useSubmit: () => useAppMutation<"submitFlow">({
                url: { baseUrl: "/submit-flow" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/my-flow"] as any });
                }
            }),
            useApprove: (id: number) => useAppMutation<"approveStep">({
                url: { baseUrl: "/flow-instance/:id/approve", urlParams: { id } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow-instance"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/my-flow"] as any });
                }
            }),
            useReject: (id: number) => useAppMutation<"rejectStep">({
                url: { baseUrl: "/flow-instance/:id/reject", urlParams: { id } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/flow-instance"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/my-flow"] as any });
                }
            }),
            useCreateCategory: () => useAppMutation<"createCategory">({
                url: { baseUrl: "/categories" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/categories"] as any });
                }
            }),
        },
        social: {
            useCreateThread: () => useAppMutation<"createThread">({
                url: { baseUrl: "/social/threads" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/social/feed"] as any });
                }
            }),
            useLikeThread: () => useAppMutation<"likeThread">({
                url: { baseUrl: "/social/threads/:id/like" },
                onSuccess: (_data, payload) => {
                    const id = payload?.urlParams?.id;
                    queryClient.invalidateQueries({ queryKey: ["/social/feed"] as any });
                    if (id) {
                        queryClient.invalidateQueries({ queryKey: ["/social/threads", id] as any });
                    }
                }
            }),
            useFollowUser: () => useAppMutation<"followUser">({
                url: { baseUrl: "/social/users/:id/follow" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/social/feed"] as any });
                }
            }),
        },
        friends: {
            useSendRequest: (id: number) => useAppMutation<"sendFriendRequest">({
                url: { baseUrl: "/friends/request/:id", urlParams: { id } },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/social/friend-requests/sent"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/friends/status", id] as any });
                    queryClient.invalidateQueries({ queryKey: ["/friends"] as any });
                }
            }),
            useHandleRequest: (id: number) => useAppMutation<"handleFriendRequest">({
                url: { baseUrl: "/friends/request/:id", urlParams: { id } },
                method: "PUT",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/social/friend-requests/received"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/social/friend-requests/sent"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/friends"] as any });
                }
            }),
            useUnfriend: (id: number) => useAppMutation<"unfriend">({
                url: { baseUrl: "/friends/:id", urlParams: { id } },
                method: "DELETE",
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/friends"] as any });
                    queryClient.invalidateQueries({ queryKey: ["/friends/status", id] as any });
                }
            }),
        },
        chat: {
            useCreateChannel: () => useAppMutation<"createChannel">({
                url: { baseUrl: "/communication/chat/channels" },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["/communication/chat/channels"] as any });
                }
            }),
            useSendMessage: () => useAppMutation<"sendMessage">({
                url: { baseUrl: "/communication/chat/messages" },
                onSuccess: (data) => {
                    const channelId = data.kenhChatId;
                    queryClient.invalidateQueries({ queryKey: [`/communication/chat/channels/${channelId}/messages`] as any });
                    queryClient.invalidateQueries({ queryKey: ["/communication/chat/channels"] as any });
                }
            })
        }
    };
};
