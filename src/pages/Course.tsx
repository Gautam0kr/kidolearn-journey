import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Star,
  Trophy,
  Clock
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth and load course data
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      loadCourseData();
    });
  }, [courseId, navigate]);

  const loadCourseData = async () => {
    try {
      // Load course details
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (!courseData) {
        navigate("/dashboard");
        return;
      }

      setCourse(courseData);

      // Load lessons for this course
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('lesson_order');

      setLessons(lessonsData || []);

      // Load user progress
      if (user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        setUserProgress(progressData || []);
      }

    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startLesson = async (lessonId: string) => {
    if (!user) return;

    try {
      // Check if progress already exists
      const existingProgress = userProgress.find(p => p.lesson_id === lessonId);
      
      if (!existingProgress) {
        // Create new progress entry
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            course_id: courseId,
            lesson_id: lessonId,
            status: 'in_progress'
          });

        if (error) {
          console.error('Error creating progress:', error);
        } else {
          toast({
            title: "Lesson Started!",
            description: "Good luck with your learning!"
          });
          // Reload progress
          loadCourseData();
        }
      }

      // Navigate to lesson (for now, we'll show a completion dialog)
      setTimeout(() => {
        completeLesson(lessonId);
      }, 2000);

    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;

    try {
      const lesson = lessons.find(l => l.id === lessonId);
      
      // Update progress to completed
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          status: 'completed',
          score: 100,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error completing lesson:', error);
        return;
      }

      // Update user points
      const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            points: profile.points + (lesson?.points_reward || 50)
          })
          .eq('user_id', user.id);
      }

      toast({
        title: "Lesson Completed! 🎉",
        description: `Great job! You earned ${lesson?.points_reward || 50} points!`
      });

      // Reload progress
      loadCourseData();

    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const getLessonStatus = (lessonId: string) => {
    const progress = userProgress.find(p => p.lesson_id === lessonId);
    return progress?.status || 'not_started';
  };

  const getCompletedLessons = () => {
    return userProgress.filter(p => p.status === 'completed').length;
  };

  const getProgressPercentage = () => {
    if (lessons.length === 0) return 0;
    return Math.round((getCompletedLessons() / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-4 mx-auto animate-spin">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {course.title}
                </h1>
              </div>
            </div>
            <Badge variant="secondary">{course.difficulty_level}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Course Overview */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{course.title}</CardTitle>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">{course.points_reward} points total</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{lessons.length} lessons</span>
                  </div>
                </div>
              </div>
              <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="text-4xl">
                  {course.subject === "Mathematics" ? "🔢" : 
                   course.subject === "Science" ? "🧪" : "📚"}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {getCompletedLessons()} of {lessons.length} lessons completed
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Course Lessons</h3>
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id);
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in_progress';
              
              return (
                <Card key={lesson.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-success text-white' 
                            : isInProgress 
                              ? 'bg-primary text-white'
                              : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{lesson.title}</h4>
                          <p className="text-muted-foreground">{lesson.content || "Interactive lesson content"}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{lesson.lesson_type}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-primary" />
                              <span className="text-sm">{lesson.points_reward} points</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        {isCompleted ? (
                          <Badge className="bg-success">Completed</Badge>
                        ) : (
                          <Button 
                            onClick={() => startLesson(lesson.id)}
                            disabled={isInProgress}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isInProgress ? "In Progress" : "Start Lesson"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;