module Api
    module V1
      class WorkflowsController < ApplicationController
        before_action :set_workflow, only: [:show, :update, :destroy]
  
        def index
          workflows = current_user.company.workflows
          render json: workflows, status: :ok
        end
  
        def show
          render json: @workflow, include: :tasks, status: :ok
        end
  
        def create
          workflow = current_user.company.workflows.new(workflow_params)
          if workflow.save
            render json: workflow, status: :created
          else
            render json: { errors: workflow.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        def update
          if @workflow.update(workflow_params)
            render json: @workflow, status: :ok
          else
            render json: { errors: @workflow.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        def destroy
          @workflow.destroy
          head :no_content
        end
  
        private
  
        def set_workflow
          @workflow = current_user.company.workflows.find(params[:id])
        end
  
        def workflow_params
          params.require(:workflow).permit(:name)
        end
      end
    end
  end
  