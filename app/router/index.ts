
import { createProject, getProject, projectList, updateProjectContent } from "./project";
import { membersList, workspaceList } from "./workspace";
export const router = {
    workspace: {
        list: workspaceList,
        members: {
            list: membersList
        }
    },
    project: {
        create: createProject,
        list: projectList,
        get: getProject,
        update: updateProjectContent
    }
}