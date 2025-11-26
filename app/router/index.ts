
import { createProject, getProject, projectList, updateProjectContent } from "./project";
import { workspaceList } from "./workspace";
export const router = {
    workspace: {
        list: workspaceList,
    },
    project: {
        create: createProject,
        list: projectList,
        get: getProject,
        update: updateProjectContent
    }
}