export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type TimestampColumns = {
  created_at: string;
  updated_at: string;
};

type SoftDeleteColumn = {
  deleted_at: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            display_name: string | null;
            avatar_url: string | null;
            home_region_id: string | null;
          },
        {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          home_region_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          home_region_id?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      regions: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            parent_region_id: string | null;
            slug: string;
            name: string;
            region_type: string;
            country_code: string | null;
            latitude: number | null;
            longitude: number | null;
            metadata: Json;
          },
        {
          id?: string;
          parent_region_id?: string | null;
          slug: string;
          name: string;
          region_type: string;
          country_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          parent_region_id?: string | null;
          slug?: string;
          name?: string;
          region_type?: string;
          country_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      species: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            common_name: string;
            scientific_name: string | null;
            description: string | null;
            habitat: string | null;
            rarity: string;
            image_url: string | null;
            metadata: Json;
          },
        {
          id?: string;
          common_name: string;
          scientific_name?: string | null;
          description?: string | null;
          habitat?: string | null;
          rarity?: string;
          image_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          common_name?: string;
          scientific_name?: string | null;
          description?: string | null;
          habitat?: string | null;
          rarity?: string;
          image_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      species_regions: Table<
        TimestampColumns & {
          id: string;
          species_id: string;
          region_id: string;
          presence_status: string;
        },
        {
          id?: string;
          species_id: string;
          region_id: string;
          presence_status?: string;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          species_id?: string;
          region_id?: string;
          presence_status?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      catches: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            user_id: string;
            species_id: string | null;
            caught_at: string;
            location_name: string | null;
            region_id: string | null;
            latitude: number | null;
            longitude: number | null;
            length_value: number | null;
            length_unit: string | null;
            weight_value: number | null;
            weight_unit: string | null;
            notes: string | null;
            weather_snapshot: Json;
            privacy: string;
          },
        {
          id?: string;
          user_id: string;
          species_id?: string | null;
          caught_at?: string;
          location_name?: string | null;
          region_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          length_value?: number | null;
          length_unit?: string | null;
          weight_value?: number | null;
          weight_unit?: string | null;
          notes?: string | null;
          weather_snapshot?: Json;
          privacy?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          user_id?: string;
          species_id?: string | null;
          caught_at?: string;
          location_name?: string | null;
          region_id?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          length_value?: number | null;
          length_unit?: string | null;
          weight_value?: number | null;
          weight_unit?: string | null;
          notes?: string | null;
          weather_snapshot?: Json;
          privacy?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      catch_media: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            catch_id: string;
            user_id: string;
            media_type: string;
            storage_bucket: string;
            storage_path: string;
            thumbnail_storage_bucket: string | null;
            thumbnail_storage_path: string | null;
            width: number | null;
            height: number | null;
            thumbnail_width: number | null;
            thumbnail_height: number | null;
            mime_type: string | null;
            file_size_bytes: number | null;
            upload_status: string;
          },
        {
          id?: string;
          catch_id: string;
          user_id: string;
          media_type?: string;
          storage_bucket?: string;
          storage_path: string;
          thumbnail_storage_bucket?: string | null;
          thumbnail_storage_path?: string | null;
          width?: number | null;
          height?: number | null;
          thumbnail_width?: number | null;
          thumbnail_height?: number | null;
          mime_type?: string | null;
          file_size_bytes?: number | null;
          upload_status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          catch_id?: string;
          user_id?: string;
          media_type?: string;
          storage_bucket?: string;
          storage_path?: string;
          thumbnail_storage_bucket?: string | null;
          thumbnail_storage_path?: string | null;
          width?: number | null;
          height?: number | null;
          thumbnail_width?: number | null;
          thumbnail_height?: number | null;
          mime_type?: string | null;
          file_size_bytes?: number | null;
          upload_status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      user_fishdex_entries: Table<
        TimestampColumns & {
          id: string;
          user_id: string;
          species_id: string;
          first_catch_id: string | null;
          discovered_at: string;
          catch_count: number;
          best_length_value: number | null;
          best_length_unit: string | null;
          best_weight_value: number | null;
          best_weight_unit: string | null;
        },
        {
          id?: string;
          user_id: string;
          species_id: string;
          first_catch_id?: string | null;
          discovered_at?: string;
          catch_count?: number;
          best_length_value?: number | null;
          best_length_unit?: string | null;
          best_weight_value?: number | null;
          best_weight_unit?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          id?: string;
          user_id?: string;
          species_id?: string;
          first_catch_id?: string | null;
          discovered_at?: string;
          catch_count?: number;
          best_length_value?: number | null;
          best_length_unit?: string | null;
          best_weight_value?: number | null;
          best_weight_unit?: string | null;
          created_at?: string;
          updated_at?: string;
        }
      >;
      signals: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            region_id: string | null;
            species_id: string | null;
            title: string;
            body: string | null;
            signal_type: string;
            status: string;
            starts_at: string | null;
            ends_at: string | null;
            metadata: Json;
          },
        {
          id?: string;
          region_id?: string | null;
          species_id?: string | null;
          title: string;
          body?: string | null;
          signal_type: string;
          status?: string;
          starts_at?: string | null;
          ends_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          region_id?: string | null;
          species_id?: string | null;
          title?: string;
          body?: string | null;
          signal_type?: string;
          status?: string;
          starts_at?: string | null;
          ends_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      subscriptions: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            user_id: string;
            provider: string;
            provider_customer_id: string | null;
            entitlement_id: string;
            status: string;
            current_period_started_at: string | null;
            current_period_ends_at: string | null;
            latest_event_at: string | null;
            metadata: Json;
          },
        {
          id?: string;
          user_id: string;
          provider?: string;
          provider_customer_id?: string | null;
          entitlement_id: string;
          status?: string;
          current_period_started_at?: string | null;
          current_period_ends_at?: string | null;
          latest_event_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          user_id?: string;
          provider?: string;
          provider_customer_id?: string | null;
          entitlement_id?: string;
          status?: string;
          current_period_started_at?: string | null;
          current_period_ends_at?: string | null;
          latest_event_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      ai_classifications: Table<
        TimestampColumns &
          SoftDeleteColumn & {
            id: string;
            user_id: string;
            catch_id: string | null;
            media_id: string | null;
            status: string;
            suggested_species_id: string | null;
            confidence: number | null;
            provider: string | null;
            model: string | null;
            result_payload: Json;
            error_message: string | null;
            user_confirmed_at: string | null;
          },
        {
          id?: string;
          user_id: string;
          catch_id?: string | null;
          media_id?: string | null;
          status?: string;
          suggested_species_id?: string | null;
          confidence?: number | null;
          provider?: string | null;
          model?: string | null;
          result_payload?: Json;
          error_message?: string | null;
          user_confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        },
        {
          id?: string;
          user_id?: string;
          catch_id?: string | null;
          media_id?: string | null;
          status?: string;
          suggested_species_id?: string | null;
          confidence?: number | null;
          provider?: string | null;
          model?: string | null;
          result_payload?: Json;
          error_message?: string | null;
          user_confirmed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      audit_logs: Table<
        {
          id: string;
          actor_user_id: string | null;
          action: string;
          target_table: string | null;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        },
        {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        },
        {
          id?: string;
          actor_user_id?: string | null;
          action?: string;
          target_table?: string | null;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
