#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use CGI::Cookie;
use DBI;
use JSON;
use Digest::SHA qw(sha1_hex);
my $db_name   = 'trabajofinal';
my $db_user   = 'root';
my $db_pass   = '753159';
my $db_host   = 'localhost';
my $table     = 'users';
my $cgi = CGI->new;
my $name = $cgi->param('name');
my $password = $cgi->param('password');
my $email  = $cgi->param('email');
my $telefono  = $cgi->param('phone');
my $direccion  = $cgi->param('direccion');
my $dbh = DBI->connect("DBI:mysql:database=$db_name;host=$db_host", $db_user, $db_pass);
my $sql = "INSERT INTO $table (name, email, password, phone, direccion) VALUES (?, ?, ?, ?, ?)";
my $sth = $dbh->prepare($sql);
my $result = $sth->execute($name, $email, $password, $telefono, $direccion);
$dbh->disconnect;
if($result) {
print $cgi->header(-type => 'application/json');
print '{"success": true}';
}
else{
    print $cgi->header(-type => 'application/json');
print '{"error": "Error al crear al Usuario"}';
}

